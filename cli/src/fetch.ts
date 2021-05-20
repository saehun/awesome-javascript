import axios from 'axios';
import { Octokit } from 'octokit';
import { env } from './env';
import { URL } from 'url';
import * as chalk from 'chalk';

/**
 * Fetch target package informantion
 */
export async function fetchRepo(url: URL) {
  const [, owner, repo] = url.pathname.split('/');
  const octokt = new Octokit({
    auth: env().GITHUB_TOKEN,
  });

  console.info(`${chalk.yellowBright('fetch')} - ${owner}/${repo}`);

  const { data: gitMeta } = await octokt.rest.repos.get({
    owner,
    repo,
  });

  const {
    data: { names: topics },
  } = await octokt.rest.repos.getAllTopics({
    owner,
    repo,
  });

  const branch = gitMeta.default_branch;
  const { data: pkgJson } = await axios.get(
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json,',
      },
    }
  );

  return {
    repo,
    owner,
    topics,
    pkgJson,
    gitMeta,
  };
}
