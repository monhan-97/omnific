import fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';

import prettyBytes from 'pretty-bytes';
import type { Stats } from '@rspack/core';
import type { AwaitedType } from '@omnific/types';

import { gzipSync } from './gzip-size';
import { readdir } from './fs-extra';
import stripAnsi from './strip-ansi';

import paths from '../paths';

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;

const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

type PrintAsset = {
  folder: string;
  name: string;
  size: number;
  sizeLabel: string;
  gzipLabel: string;
  sizeLabelLength: number;
  gzipLabelLength: number;
};

/**
 * 是不是可以读取的资源
 * @param asset
 * @returns
 */
function canReadAsset(asset: string) {
  return (
    /\.(js|css)$/.test(asset) &&
    !/service-worker\.js/.test(asset) &&
    !/precache-manifest\.[\da-f]+\.js/.test(asset)
  );
}

function removeFileNameHash(buildFolder: string, fileName: string) {
  return fileName
    .replace(buildFolder, '')
    .replaceAll('\\', '/')
    .replace(/\/?(.*)(\.[\da-f]+)(\.chunk)?(\.js|\.css)/, (match, p1, p2, p3, p4) => p1 + p4);
}

// 1024, 2048;
// ('(+1 KB)');
function getDifferenceLabel(currentSize: number, previousSize?: number) {
  if (!previousSize) return '';

  const FIFTY_KILOBYTES = 1024 * 50;

  const difference = currentSize - previousSize;

  const fileSize = Number.isNaN(difference) ? '0' : prettyBytes(difference);

  if (difference >= FIFTY_KILOBYTES) {
    return styleText('red', '+' + fileSize);
  }
  if (difference < FIFTY_KILOBYTES && difference > 0) {
    return styleText('yellow', '+' + fileSize);
  }
  return difference < 0 ? styleText('green', fileSize) : '';
}

/**
 * 在构建前测量可读取构建资源的大小。
 */
export async function measureFileSizesBeforeBuild(buildFolder: string) {
  const result = {
    root: buildFolder,
    sizes: {} as Record<string, number>,
  };

  try {
    const files = await readdir(buildFolder);

    if (Array.isArray(files) && files.length > 0) {
      const canReadAssetFiles = files.filter(item => canReadAsset(item));
      for (const fileName of canReadAssetFiles) {
        const stats = fs.statSync(fileName);
        const fileKey = removeFileNameHash(buildFolder, fileName);
        result.sizes[fileKey] = stats.size;
      }
    }
  } catch {
    return result;
  }

  return result;
}

/**
 * 在构建成功后打印资源大小和 gzip 后大小。
 */
export function printFileSizesAfterBuild(
  stats: Stats,
  previousSizeMap: AwaitedType<ReturnType<typeof measureFileSizesBeforeBuild>>,
) {
  let isSuggestBundleSplitting = false;

  const root = previousSizeMap.root;

  const sizes = previousSizeMap.sizes;

  const statCompilation = stats.toJson({
    all: false,
    assets: true,
  });

  if (statCompilation.assets) {
    const assets: PrintAsset[] = [];

    const gzipLabelLengthList: number[] = [];

    const sizeLabelLengthList: number[] = [];

    for (const asset of statCompilation.assets) {
      if (!canReadAsset(asset.name)) {
        continue;
      }

      const fileContents = fs.readFileSync(path.join(root, asset.name));

      const previousSize = sizes[removeFileNameHash(root, asset.name)];

      const difference = getDifferenceLabel(asset.size, previousSize);

      const sizeLabel = prettyBytes(asset.size) + (difference ? ' (' + difference + ')' : '');

      const gzipLabel = 'gzip : ' + prettyBytes(gzipSync(fileContents));

      const sizeLabelLength = stripAnsi(sizeLabel).length;

      const gzipLabelLength = stripAnsi(gzipLabel).length;

      assets.push({
        folder: path.join(path.basename(paths.appBuild), path.dirname(asset.name)),
        name: path.basename(asset.name),
        size: asset.size,
        sizeLabel: sizeLabel,
        gzipLabel: gzipLabel,
        sizeLabelLength: sizeLabelLength,
        gzipLabelLength: gzipLabelLength,
      });

      gzipLabelLengthList.push(gzipLabelLength);

      sizeLabelLengthList.push(sizeLabelLength);
    }

    assets.sort((a, b) => b.size - a.size);

    //找出最长度的字符串 对齐展示打印信息
    const longestSizeLabelLength = Math.max.apply(undefined, sizeLabelLengthList);

    const longestGzipSizeLabelLength = Math.max.apply(undefined, gzipLabelLengthList);

    for (const asset of assets) {
      let sizeLabel = asset.sizeLabel;

      let gzipLabel = asset.gzipLabel;

      const sizeLabelLength = asset.sizeLabelLength;

      const gzipLabelLength = asset.gzipLabelLength;

      if (sizeLabelLength < longestSizeLabelLength) {
        sizeLabel += ' '.repeat(longestSizeLabelLength - sizeLabelLength);
      }

      if (gzipLabelLength < longestGzipSizeLabelLength) {
        gzipLabel += ' '.repeat(longestGzipSizeLabelLength - gzipLabelLength);
      }

      const isMainBundle = asset.name.indexOf('main.') === 0;

      const maxRecommendedSize = isMainBundle
        ? WARN_AFTER_BUNDLE_GZIP_SIZE
        : WARN_AFTER_CHUNK_GZIP_SIZE;

      const isLarge = maxRecommendedSize && asset.size > maxRecommendedSize;

      if (isLarge && path.extname(asset.name) === '.js') {
        isSuggestBundleSplitting = true;
      }

      console.log(
        '  ' + (isLarge ? styleText('yellow', sizeLabel) : sizeLabel) + ' '.repeat(3) + gzipLabel,
        '  ' + styleText('dim', asset.folder + path.sep) + styleText('cyan', asset.name),
      );
    }
  }

  if (isSuggestBundleSplitting) {
    console.log();
    console.log(styleText('yellow', 'The bundle size is significantly larger than recommended.'));
    console.log(
      styleText('yellow', 'You can also analyze the project dependencies: https://goo.gl/LeUzfb'),
    );
  }
}
