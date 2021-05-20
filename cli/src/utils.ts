import * as cp from 'child_process';
import { readSync } from 'clipboardy';
import { URL } from 'url';
import { promisify } from 'util';

/**
 * You don't need execa anymore!
 */
const exec = promisify(cp.exec);

/**
 * Run shell command
 */
export async function run(command: string, option: { silence: boolean } = { silence: false }): Promise<string> {
  const { stdout } = await exec(command);
  if (option.silence == false) {
    console.log(stdout);
  }
  return stdout;
}

/**
 * Memoize once
 */
export const memo = <R, A extends any[]>(fn: (...args: A) => R, cache?: any) => (...args: A): R =>
  cache === undefined ? (cache = fn(...args)) : cache;

/**
 * Parse text to url and validate
 */
export function toURL(text: string) {
  const url = new URL(text);
  if (!['github.com', 'www.npmjs.com'].includes(url.host)) {
    throw new Error(`Invalid URL: '${text}'`);
  }
  return url;
}

/**
 * Get input from command line arguments or clipboard
 */
export const getInputURL = memo((text = process.argv[2]) => {
  return toURL(text ?? readSync());
});
