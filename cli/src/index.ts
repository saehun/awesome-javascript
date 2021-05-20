import { appendJsonAndSave } from './appendJsonAndSave';
import { exportMarkdown } from './exportMarkdown';
import { fetchRepo } from './fetch';
import { getInputURL } from './utils';

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

  const infoMap = await appendJsonAndSave({
    repo,
    owner,
    topics,
    size,
    keywords,
    name: name ?? repo,
    stars: stargazers_count,
    description: description || '',
  });

  await saveReadme(exportMarkdown(infoMap));
  await commit(`add ${owner}/${repo}`);
  // await push();
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
