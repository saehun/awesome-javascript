import * as fs from 'fs-extra';
import { env } from './env';
import * as path from 'path';

export async function saveReadme(pairs: Array<[string, string]>) {
  for (const [readmePath, content] of pairs) {
    fs.ensureFileSync(path.join(env().REPO_PATH, readmePath));
    fs.writeFileSync(path.join(env().REPO_PATH, readmePath), content, { encoding: 'utf-8' });
  }
}
