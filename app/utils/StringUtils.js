import last from 'lodash/array/last';

export function getFilename(str) {
  return last(str.split('/'));
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
