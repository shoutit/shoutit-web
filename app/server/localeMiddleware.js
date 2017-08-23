import debug from 'debug';
import { removeParamsFromUrl } from '../utils/StringUtils';
import { LANGUAGES, LOCALES } from '../config';

const log = debug('shoutit:server:localeMiddleware');

function isLocaleSupported(locale) {
  return LOCALES.indexOf(locale) !== -1;
}

function isLanguageSupported(language) {
  return LANGUAGES.indexOf(language) !== -1;
}

function getLocaleFromLanguage(language) {
  return LOCALES.find(locale => locale.split('_')[0] === language);
}

export default function localeMiddleware(req, res, next) {
  if (req.query.fb_locale && isLocaleSupported(req.query.fb_locale)) {
    req.session.language = req.query.fb_locale.split('_')[0];
    log('Detected language from ?fb_locale=%s param: %s', req.query.fb_locale, req.session.language);
  } else if (req.query.hl && isLanguageSupported(req.query.hl)) {
    req.session.language = req.query.hl;
    log('Detected language from ?hl param: %s', req.session.language);
    req.session.save(() => res.redirect(removeParamsFromUrl(req.url, ['hl'])));
    return;
  } else if (!(req.session.language)) {
    req.session.language = req.acceptsLanguages(LANGUAGES) || LANGUAGES[0];
    log('Detected language from accept-language: %s', req.session.language);
  }
  req.locale = getLocaleFromLanguage(req.session.language);
  next();
}
