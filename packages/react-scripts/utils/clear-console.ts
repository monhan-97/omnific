/**
 * 清除控制台的信息
 */
function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\u{1B}[2J\u{1B}[0f' : '\u{1B}[2J\u{1B}[3J\u{1B}[H',
  );
}

export default clearConsole;
