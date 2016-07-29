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
  es: () => require('react-intl?locale=es!./empty.json'),
  zh: () => require('react-intl?locale=zh!./empty.json'),
};

export const loadLocaleData = locale => {
  return new Promise(resolve => {
    locales[locale]()(resolve);
  });
};

const intlCache = {};
export const numberFromString = (value, { locale, formatNumber }) => {
  if (!intlCache.hasOwnProperty(locale)) {
    const formatted = formatNumber(12345.6789);
    const decimalSeparator = formatted.match(/345(.*)67/)[1];
    const thousandSeparator = formatted.match(/12(.*)345/)[1];
    intlCache[locale] = { decimalSeparator, thousandSeparator };
  }
  const n = value
    .replace(intlCache[locale].thousandSeparator, '')
    .replace(intlCache[locale].decimalSeparator, '.');
  return +n;
};
