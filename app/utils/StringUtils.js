import last from 'lodash/last';
import omit from 'lodash/omit';
import queryString from 'query-string';

export function getFilename(str) {
  return last(str.split('/'));
}

const titleCaseRegExp = /[\u00BF-\u1FFF\u2C00-\uD7FF\w]*/g;
/**
 * Transform a string to title case
 *
 * @export
 * @param {String} str
 * @returns
 */
export function toTitleCase(str) {
  return str.replace(titleCaseRegExp, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Removes one or more params from an url
 *
 * @export
 * @param {String} url
 * @param {String|Array} params
 * @returns
 */
export function removeParamsFromUrl(url, params) {
  const path = url.split('?')[0];
  let qs = url.split('?')[1] || '';
  if (qs) {
    qs = queryString.stringify(
      omit(
        queryString.parse(qs),
        params
      ));
    if (qs) {
      qs = `?${qs}`;
    }
  }
  return `${path}${qs}`;
}
