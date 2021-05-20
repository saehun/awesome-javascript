import { appendJsonAndSave } from './appendJsonAndSave';
import { exportMarkdown } from './exportMarkdown';
import { fetchRepo } from './fetch';
import { commit, push } from './git';
import { saveReadme } from './saveReadme';
import { getInputURL } from './utils';
import * as rimraf from 'rimraf';
import { env } from './env';
import * as chalk from 'chalk';

export async function handleNpm() {
  throw new Error('Not implemented');
}

export async function handleGithub() {
  const {
    repo,
    owner,
    topics,
    gitMeta: { description, size, stargazers_count },
    pkgJson: { name, keywords = [] },
  } = await fetchRepo(getInputURL());

  const newInfo = {
    repo,
    owner,
    topics,
    size,
    keywords,
    name: name ?? repo,
    stars: stargazers_count,
    description: description || '',
  };

  console.info(`${chalk.yellowBright('found')} - \n`, newInfo);

  const infoMap = await appendJsonAndSave(newInfo);
  rimraf.sync(env().REPO_PATH + '/tags');
  await saveReadme(exportMarkdown(infoMap));

  console.info(`${chalk.yellowBright('convert and save')}`);

  await commit(`add ${owner}/${repo}`);
  await push();
}

/**
 * Entry
 */
async function main() {
  if (getInputURL().host.includes('npm')) {
    await handleNpm();
  } else {
    await handleGithub();
  }
}
main();
