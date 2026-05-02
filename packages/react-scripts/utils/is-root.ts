/**
 * 检查进程是否以 root 用户身份运行
 */
function isRoot() {
  return process.getuid && process.getuid() === 0;
}

export default isRoot;
