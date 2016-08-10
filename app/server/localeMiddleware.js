import debug from 'debug';
import { locales } from '../config';
const log = debug('shoutit:server:localeMiddleware');

function isLocaleSupported(locale) {
  return locales.indexOf(locale) > -1;
}

const maxAge = 365 * 24 * 60 * 60 * 1000;

export default function localeMiddleware(req, res, next) {
  if (req.query.fb_locale && isLocaleSupported(req.query.fb_locale)) {
    req.locale = req.query.fb_locale;
    log('Detected locale from ?fb_locale param: %s', req.locale);
  } else if (req.query.hl && isLocaleSupported(req.query.hl)) {
    req.locale = req.query.hl;
    log('Detected locale from ?hl param: %s', req.locale);
    if ('set' in req.query) {
      log('Locale cookie has been set to %s', req.locale);
      res.cookie('hl', req.locale, { maxAge });
    }
  } else if (req.cookies.hl && isLocaleSupported(req.cookies.hl)) {
    req.locale = req.cookies.hl;
    log('Detected locale from cookie: %s', req.locale);
  } else {
    req.locale = req.acceptsLanguages(locales) || 'en';
    log('Detected locale from accept-language: %s', req.locale);
  }
  next();
}
