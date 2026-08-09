import url from 'node:url';
import { exit } from 'node:process';
import { styleText } from 'node:util';

import type { Compiler, Configuration } from '@rspack/core';
import { rspack } from '@rspack/core';
import type { Options } from 'get-port';
import getPort from 'get-port';
import { isArrayEmpty } from '@omnific/utils';

import { ip } from './address';
import isRoot from './is-root';
import clearConsole from './clear-console';
import { confirm } from './confirm';

//检测是不是在终端执行命令
const isInteractive = process.stdout.isTTY;

function printInstructions(appName: string, urls: ReturnType<typeof prepareUrls>) {
  console.log();
  console.log(`You can now view ${styleText('bold', appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(`  ${styleText('bold', 'Local:')}            ${urls.localUrlForTerminal}`);
    console.log(`  ${styleText('bold', 'On Your Network:')}  ${urls.lanUrlForTerminal}`);
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log('Note that the development build is not optimized.');
}

/**
 * 准备URL 数据
 */
export function prepareUrls(options: {
  protocol: string;
  host: string;
  port: number;
  pathname?: string;
}) {
  const { protocol, host, port, pathname = '/' } = options;

  function formatUrl(hostname: string) {
    return url.format({
      protocol,
      hostname,
      port,
      pathname,
    });
  }

  function prettyPrintUrl(hostname: string) {
    return url.format({
      protocol,
      hostname,
      port: styleText('bold', String(port)),
      pathname,
    });
  }

  //检测是不是特殊的域名
  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  let prettyHost;
  let lanUrlForConfig;
  let lanUrlForTerminal;

  if (isUnspecifiedHost) {
    prettyHost = 'localhost';
    try {
      // This can only return an IPv4 address
      lanUrlForConfig = ip();
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (/^10\.|^172\.(1[6-9]|2\d|3[01])\.|^192\.168\./.test(lanUrlForConfig)) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch {
      // ignored
    }
  } else {
    prettyHost = host;
  }
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser,
  };
}

/**
 * 选择端口
 * @param defaultPort 默认端口
 * @param host 域名
 */
export async function choosePort(options: Options) {
  try {
    const port = await getPort(options);

    if (port === options.port) {
      return port;
    }

    // 1. 需要管理员权限才能在低于1024的端口上运行
    // 2. 检测到端口已经被占用
    const message =
      process.platform === 'win32' || port >= 1024 || isRoot()
        ? `Something is already running on port ${port}.`
        : `Admin permissions are required to run a server on a port below 1024.`;

    if (isInteractive) {
      clearConsole();
      const shouldChangePort = await confirm({
        message:
          styleText('yellow', message) +
          '\n\nWould you like to run the app on another port instead',
      });

      return shouldChangePort ? port : undefined;
    }
    console.log(styleText('red', message));
    return;
  } catch (error: any) {
    throw new Error(
      styleText('red', `Could not find an open port at ${styleText('bold', options.host!)}.`) +
        '\n' +
        ('Network error message: ' + error.message || error) +
        '\n',
    );
  }
}

/**
 * 编辑webpack配置
 */
export function createCompiler(options: {
  appName: string;
  config: Configuration;
  urls: ReturnType<typeof prepareUrls>;
}) {
  const { appName, config, urls } = options;

  let compiler: Compiler | undefined;
  try {
    compiler = rspack(config);
  } catch (error: any) {
    console.log(styleText('red', 'Failed to compile.'));
    console.log();
    console.log(error.message || error);
    console.log();
    exit(1);
  }
  // "invalid" event fires when you have changed a file, and webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  let isFirstCompile = true;

  // "done" event fires when webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap('done', async stats => {
    if (isInteractive) {
      clearConsole();
    }

    // We have switched off the default webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We only construct the warnings and errors for speed:
    // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const errors = statsData.errors ?? [];

    const warnings = statsData.warnings ?? [];

    const isSuccessful = isArrayEmpty(errors) && isArrayEmpty(warnings);

    if (isSuccessful) {
      console.log(styleText('green', 'Compiled successfully!'));
    }
    if (isSuccessful && (isInteractive || isFirstCompile)) {
      printInstructions(appName, urls);
    }
    isFirstCompile = false;

    // If errors exist, only show errors.
    if (errors.length > 0) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (errors.length > 1) {
        errors.length = 1;
      }
      console.log(styleText('red', 'Failed to compile.\n'));
      console.log(errors.join('\n\n'));
      return;
    }

    // Show warnings if no errors were found.
    if (warnings.length > 0) {
      console.log(styleText('yellow', 'Compiled with warnings.\n'));
      console.log(warnings.join('\n\n'));

      // Teach some ESLint tricks.
      console.log(
        '\nSearch for the ' +
          styleText('underline', styleText('yellow', 'keywords')) +
          ' to learn more about each warning.',
      );

      console.log(
        'To ignore, add ' +
          styleText('cyan', '// eslint-disable-next-line') +
          ' to the line before.\n',
      );
    }
  });

  return compiler;
}
