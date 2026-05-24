const isAbsoluteURL = (url: string) => {
  return /^([a-z][\d+.a-z]*:)?\/\//i.test(url);
};

export default isAbsoluteURL;
