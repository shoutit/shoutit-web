/* eslint import/namespace: 0 */
/* global window */

import React from 'react';

import * as config from './';

/**
 * Returns the value of a configuration variable, either from the global
 * scope (for browsers) or from process.env (server environment)
 *
 * For example:
 *
 * console.log(getVariable('myThing'))
 * // -> on browser, prints window.APP.myThing
 * // -> on server, prints process.env.APP_MYTHING
 *
 * @export
 * @param {any} name
 * @returns
 */
export function getVariable(name) {
  if (process.env.BROWSER) {
    return window.APP[name];
  }
  return process.env[`APP_${name}`];
}

/**
 * Renders a <script> tag with all the config variables
 * in a global var.
 *
 * @export
 * @return
 */
export function ConfigScript() {
  const vars = Object.keys(config)
    .filter(key => typeof config[key] === 'string')
    .map(key =>
      `'${key}':'${config[key]}'`
    )
    .join(',');
  const html = `window.APP={${vars}}`;
  return (
    <script dangerouslySetInnerHTML={ { __html: html } } />
  );
}
