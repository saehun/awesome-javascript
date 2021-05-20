import { Info } from './Info';

const Header = `
<div align="center">
	<img width="500" height="350" src="logo.svg" alt="Awesome">
	<br>
</div>

> This list do not contain major project e.g. React, Express, Axios.. etc.

## Related
- [All Awesome Lists](https://github.com/topics/awesome) - All the Awesome lists on GitHub.
- [Awesome](https://github.com/awesome/sindresorhus) - Original awesome by sindresorhus
- [Awesome Indexed](https://awesome-indexed.mathew-davies.co.uk) - Search the Awesome dataset.
- [Awesome Search](https://awesomelists.top) - Quick search for Awesome lists.
- [StumbleUponAwesome](https://github.com/basharovV/StumbleUponAwesome) - Discover random pages from the Awesome dataset using a browser extension.
- [Awesome CLI](https://github.com/umutphp/awesome-cli) - A simple command-line tool to dive into Awesome lists.
- [Awesome NodeJS](https://github.com/sindresorhus/awesome-nodejs) - Delightful Node.js packages and resources

## Packages
`;

const TagHeader = `

## Tags
`;

const MINIMUM_TAG_COUNT = 2;

/**
 * Export data to markdown.
 */
export function exportMarkdown(data: Record<string, Info>): Array<[string, string]> {
  const tagIndex: Record<string, Info[]> = {};
  const list: Info[] = [];

  for (const key in data) {
    const info = data[key];
    list.push(info);

    sanitizeTags([...info.keywords, ...info.topics].map(tag => tag.toLowerCase())).forEach(tag => {
      appendTagIndex(tag, info);
    });
  }

  return [
    toMarkdownIndex(list, tagIndex),
    ...Object.entries(tagIndex)
      .filter(([, infoList]) => infoList.length >= MINIMUM_TAG_COUNT)
      .map(([tag, infoList]) => toMarkdownTag(tag, infoList)),
  ];

  function appendTagIndex(tag: string, info: Info) {
    if (!(tag in tagIndex)) {
      tagIndex[tag] = [];
    }
    tagIndex[tag].push(info);
  }
}

function toMarkdownIndex(infoList: Info[], tagIndex: Record<string, Info[]>): [path: string, content: string] {
  return ['README.md', Header + infoList.map(convertToListItem).join('\n') + TagHeader + convertToTagSection(tagIndex)];
}

function convertToTagSection(tagIndex: Record<string, Info[]>) {
  return Object.entries(tagIndex)
    .filter(([, infoList]) => infoList.length >= MINIMUM_TAG_COUNT)
    .sort((a, b) => a[1].length - b[1].length)
    .map(([tag, infoList]) => `[${tag}(${infoList.length})](tags/${tag}/README.md)`)
    .join(' ');
}

function toMarkdownTag(tag: string, infoList: Info[]): [path: string, content: string] {
  return [`tags/${tag}/README.md`, `## ${tag}` + '\n\n' + infoList.map(convertToListItem).join('\n')];
}

const cache: Record<string, string> = {};
function convertToListItem(info: Info) {
  const key = info.name;
  if (key in cache) {
    return cache[key];
  } else {
    const line = `- [${info.name}](https://github.com/${info.owner}/${info.repo}) ${info.description}`;
    cache[key] = line;
    return line;
  }
}

const sanitizeTable: Record<string, string> = {
  /** Remove casual */
  node: '',
  nodes: '',
  nodejs: '',
  js: '',
  javascript: '',
  ts: '',
  typescript: '',
  is: '',
  types: '',
  typeof: '',
  instanceof: '',
  'npm-package': '',
  'npm-packages': '',
  'node-module': '',
  'node-modules': '',

  /** Deduplicate */
  check: 'check',
  checking: 'check',

  validates: 'validate',
  validation: 'validate',
  validations: 'validate',

  utils: 'util',
  utility: 'util',
  utilities: 'util',

  objects: 'object',

  asserts: 'assert',
  assertion: 'assert',
  assertions: 'assert',
};

function sanitizeTags(tags: string[]) {
  const tagSet = new Set<string>();
  for (let tag of tags) {
    tag = tag.replace(/\s/g, '-');
    if (tag in sanitizeTable) {
      tagSet.add(sanitizeTable[tag]);
    } else {
      tagSet.add(tag);
    }
  }

  tagSet.delete('');
  return Array.from(tagSet);
}
