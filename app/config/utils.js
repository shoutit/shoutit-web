/* eslint import/namespace: 0 */

import React from 'react';

import * as config from './';

export const GLOBAL_VAR_NAME = 'window.APP';
export const ENV_VAR_PREFIX = 'APP';

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
    return GLOBAL_VAR_NAME[name];
  }
  return process.env[`${ENV_VAR_PREFIX}_${name.toUpperCase()}`];
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
  const html = `${GLOBAL_VAR_NAME}={${vars}}`;
  return (
    <script dangerouslySetInnerHTML={ { __html: html } } />
  );
}
