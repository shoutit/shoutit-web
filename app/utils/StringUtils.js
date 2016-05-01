import last from 'lodash/array/last';

export function getFilename(str) {
  return last(str.split('/'));
}
