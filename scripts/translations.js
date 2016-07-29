/* eslint-disable no-console */
import * as fs from 'fs';
import pathExists from 'path-exists';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';
import { locales } from '../app/config';

const MESSAGES_PATTERN = './assets/intl/messages/**/*.json';
const TRANSLATIONS_PATH = './assets/intl/translations';

const log = console.log;

log('Reading files in %s...', MESSAGES_PATTERN);

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
  console.log('\nBuilding %s.json...', lang);
  const file = `${TRANSLATIONS_PATH}/${lang}.json`;
  let existingMessages = {};
  if (pathExists.sync(file)) {
    existingMessages = JSON.parse(fs.readFileSync(file, 'utf8'));
    // Remove existing messages not present between the defaults
    Object.keys(existingMessages).forEach(messageId => {
      if (!defaultMessages.hasOwnProperty(messageId)) {
        delete existingMessages[messageId];
        log('   Deleted not existing message with id %s', messageId);
      }
    });
  }
  const unsortedMessages = { ...defaultMessages, ...existingMessages };
  const sortedMessages = {};
  Object.keys(unsortedMessages)
    .sort()
    .forEach(key => {
      sortedMessages[key] = unsortedMessages[key];
    });
  const filecontent = JSON.stringify(sortedMessages, null, 2);
  fs.writeFileSync(file, filecontent);
  log('   Saved %s messages (%s were new)', Object.keys(sortedMessages).length, Object.keys(sortedMessages).length - Object.keys(existingMessages).length);
});

log();