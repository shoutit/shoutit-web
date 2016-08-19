import debug from 'debug';
import { removeParamsFromUrl } from '../utils/StringUtils';
import { languages, locales } from '../config';
const log = debug('shoutit:server:localeMiddleware');

function isLocaleSupported(locale) {
  return locales.indexOf(locale) > -1;
}

function isLanguageSupported(language) {
  return languages.indexOf(language) > -1;
}

function getLocaleFromLanguage(language) {
  return locales.find(locale => locale.split('_')[0] === language);
}

const maxAge = 365 * 24 * 60 * 60 * 1000;

export default function localeMiddleware(req, res, next) {
  if (req.query.fb_locale && isLocaleSupported(req.query.fb_locale)) {
    req.language = req.query.fb_locale.split('_')[0];
    log('Detected language from ?fb_locale=%s param: %s', req.query.fb_locale, req.language);
  } else if (req.query.hl && isLanguageSupported(req.query.hl)) {
    req.language = req.query.hl;
    log('Detected language from ?hl param: %s', req.language);
    if ('set' in req.query) {
      log('Language cookie has been set to %s', req.language);
      res.cookie('hl', req.language, { maxAge });
      res.redirect(removeParamsFromUrl(req.url, ['hl', 'set']));
      return;
    }
  } else if (req.cookies.hl && isLanguageSupported(req.cookies.hl)) {
    req.language = req.cookies.hl;
    log('Detected language from cookie: %s', req.language);
  } else {
    req.language = req.acceptsLanguages(languages) || languages[0];
    log('Detected language from accept-language: %s', req.language);
  }
  req.locale = getLocaleFromLanguage(req.language);
  next();
}
