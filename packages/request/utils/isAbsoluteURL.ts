/**
 * 检查 URL 是否为绝对地址或协议相对地址。
 */
const isAbsoluteURL = (url: string) => {
  return /^([a-z][\d+.a-z]*:)?\/\//i.test(url);
};

export default isAbsoluteURL;
