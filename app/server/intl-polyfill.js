import areIntlLocalesSupported from 'intl-locales-supported';
import IntlPolyfill from 'intl';
import debug from 'debug';

import { LANGUAGES } from '../config';

const log = debug('shoutit:server:intl-polyfill');

if (global.Intl) {
  if (!areIntlLocalesSupported(LANGUAGES)) {
    log('Required languages not found, polyfilling...');
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  } else {
    log('No need to polyfill Intl');
  }
} else {
  log('Intl API not found, polyfilling...');
}
