import { env, getInputURL, toURL } from '../index';

describe('', () => {
  it('env', () => {
    const mock = {
      GITHUB_TOKEN: 'foo-bar-github-token',
      NPM_TOKEN: 'baz-npm-token',
    };
    expect(env(mock)).toEqual(mock);
  });

  it('validateURL', () => {
    expect(() => toURL('https://www.npmjs.com/package/*')).not.toThrow();
    expect(() => toURL('https://github.com/octokit/octokit.js')).not.toThrow();
    expect(() => toURL('https://google.com')).toThrow();
  });

  it('getInputString', () => {
    expect(getInputURL('https://www.npmjs.com/package/*')).not.toThrow();
  });
});
