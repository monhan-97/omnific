import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';

/**
 * 命令行确认问题的输入输出配置。
 */
export type ConfirmOptions = {
  /**
   * 展示给用户的问题文案。
   */
  message: string;
  /**
   * 用户直接回车时是否默认确认。
   */
  shouldConfirmByDefault?: boolean;
  /**
   * 读取用户输入的流。
   */
  input?: NodeJS.ReadableStream;
  /**
   * 写出问题文案的流。
   */
  output?: NodeJS.WritableStream;
};

/**
 * 在命令行中询问用户是否确认。
 */
export async function confirm(options: ConfirmOptions) {
  const { message, shouldConfirmByDefault = true, input = stdin, output = stdout } = options;
  const readline = createInterface({
    input,
    output,
  });

  try {
    const suffix = shouldConfirmByDefault ? ' (Y/n) ' : ' (y/N) ';
    const rawAnswer = await readline.question(message + suffix);
    const answer = rawAnswer.trim().toLowerCase();

    if (!answer) return shouldConfirmByDefault;

    return answer === 'y' || answer === 'yes';
  } finally {
    readline.close();
  }
}
