/* eslint-disable import/no-unresolved */
/* eslint-env browser */
import range from 'lodash/range';
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

export const locales = {
  ar: () => require('react-intl?locale=ar!./empty.json'),
  cs: () => require('react-intl?locale=cs!./empty.json'),
  de: () => require('react-intl?locale=de!./empty.json'),
  en: () => require('react-intl?locale=en!./empty.json'),
  es: () => require('react-intl?locale=es!./empty.json'),
  fr: () => require('react-intl?locale=fr!./empty.json'),
  hi: () => require('react-intl?locale=hi!./empty.json'),
  it: () => require('react-intl?locale=it!./empty.json'),
  pl: () => require('react-intl?locale=pl!./empty.json'),
  pt: () => require('react-intl?locale=pt!./empty.json'),
  ru: () => require('react-intl?locale=ru!./empty.json'),
  zh: () => require('react-intl?locale=zh!./empty.json'),
};

export const loadLanguageData = locale => new Promise(resolve => locales[locale]()(resolve));

const intlCache = {};

/**
 * Get a number from a string using Intl API
 */
export const numberFromString = (value, intl) => {
  const { locale, formatNumber } = intl;
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

/**
 * Get all months in a year in current locale
 */
export const getLocalizedMonths = intl => {
  const { formatDate } = intl;

  return range(12)
    .map(month => {
      const date = new Date().setMonth(month);
      return formatDate(date, { month: 'long' });
    });
};

/**
  * Calculates the order of the year, month, day based on the locale
  */
export function getDateOrderWeight(intl) {
  const { formatDate } = intl;
  const date = new Date();
  const numbersOnly = /\d+/g;
  const formatType = 'numeric';

  const localizedDate = formatDate(date, {
    year: formatType,
    month: formatType,
    day: formatType,
  });

  const localeYear = formatDate(date, { year: formatType }).match(numbersOnly)[0];
  const localeMonth = formatDate(date, { month: formatType }).match(numbersOnly)[0];
  const localeDay = formatDate(date, { day: formatType }).match(numbersOnly)[0];

  return {
    year: localizedDate.indexOf(localeYear),
    month: localizedDate.indexOf(localeMonth),
    day: localizedDate.indexOf(localeDay),
  };
}
