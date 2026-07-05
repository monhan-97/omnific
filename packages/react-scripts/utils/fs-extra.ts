import pth from 'node:path';
import fs from 'node:fs/promises';

/**
 * 删除并重新创建目录。
 */
export async function emptyDirectory(directory: string) {
  await fs.rm(directory, { recursive: true, force: true });
  await fs.mkdir(directory, { recursive: true });
}

/**
 * 检查文件系统路径是否可访问。
 */
export async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * 读取文件夹下的所有文件
 * @param path
 * @returns
 */
export async function readdir(path: string) {
  let fileList: string[] = [];

  const files = await fs.readdir(path);

  if (files.length === 0) {
    return [];
  }

  for (const file of files) {
    const filePath = pth.join(path, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      fileList = [...fileList, ...(await readdir(filePath))];
    } else {
      fileList.push(filePath);
    }
  }

  return fileList;
}

export default readdir;
