import last from 'lodash/array/last';

export function trimWhitespaces(text) {
  return text.replace(/\s*$/, '').replace(/^\s*/, '');
}

export function getFilename(str) {
  return last(str.split('/'));
}
