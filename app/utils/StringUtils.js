import last from 'lodash/last';

export function getFilename(str) {
  return last(str.split('/'));
}

export function toTitleCase(str) {
  return str.replace(/[\u00BF-\u1FFF\u2C00-\uD7FF\w]*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
