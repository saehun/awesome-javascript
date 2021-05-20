import { env } from './env';
import { run } from './utils';

export async function commit(message: string) {
  process.chdir(env().REPO_PATH);
  await run('git add .');
  return await run(`git commit -m '${message}'`);
}
