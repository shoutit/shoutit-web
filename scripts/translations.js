/* eslint-disable no-console */
import * as fs from 'fs';
import pathExists from 'path-exists';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';
import { locales } from '../app/config';

const MESSAGES_PATTERN = './assets/intl/messages/**/*.json';
const TRANSLATIONS_PATH = './assets/intl/translations';

const defaultMessages = globSync(MESSAGES_PATTERN)
    .map(filename => fs.readFileSync(filename, 'utf8'))
    .map(file => JSON.parse(file))
    .reduce((collection, descriptors) => {
      descriptors.forEach(({ id, defaultMessage }) => {
        if (collection.hasOwnProperty(id)) {
          throw new Error(`Duplicate message id: ${id}`);
        }
        collection[id] = defaultMessage;
      });
      return collection;
    }, {});

mkdirpSync(TRANSLATIONS_PATH);

locales.forEach(lang => {
  const file = `${TRANSLATIONS_PATH}/${lang}.json`;
  let existingMessages = {};
  if (pathExists(file)) {
    existingMessages = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  const unsortedMessages = { ...defaultMessages, ...existingMessages };
  const sortedMessages = {};
  Object.keys(unsortedMessages)
    .sort()
    .forEach(key => {
      sortedMessages[key] = unsortedMessages[key];
    });
  const filecontent = JSON.stringify(sortedMessages, null, 2);
  console.log(filecontent);
  fs.writeFileSync(file, filecontent);
  console.log(file);
});
