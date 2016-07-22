/* eslint-disable import/no-unresolved */
/* eslint-env browser */
import debug from 'debug';
import isIntlLocaleSupported from 'intl-locales-supported';

const log = debug('shoutit:utils:IntlUtils');

export const loadIntlPolyfill = locale => {
  if (window.Intl && isIntlLocaleSupported(locale)) {
    log('Intl and locale data for %s are available!', locale);
      // all fine: Intl is in the global scope and the locale data is available
    return Promise.resolve(false);
  }
  return new Promise(resolve => {
    log('Intl or locale data for %s not available, downloading the polyfill...', locale);
      // When building: create a intl chunk with webpack
      // When executing: run the callback once the chunk has been download.
    require.ensure(['intl'], require => {
      require('intl'); // apply the polyfill
      log('Intl polyfill for %s has been loaded', locale);
      resolve(true);
    }, 'intl');
  });
};


const locales = {
  en: () => require('react-intl?locale=en!./empty.json'),
  ar: () => require('react-intl?locale=ar!./empty.json'),
  de: () => require('react-intl?locale=de!./empty.json'),
};

export const loadLocaleData = locale => {
  return new Promise(resolve => {
    locales[locale]()(resolve);
  });
};
