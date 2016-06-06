import debug from 'debug';
import { locales } from '../config';
const log = debug('shoutit:server:localeMiddleware');

export default function localeMiddleware(req, res, next) {
  if (req.query.hl && locales.indexOf(req.query.hl) > -1) {
    req.locale = req.query.hl;
    log('Detected locale from querystring: %s', req.locale);
  } else {
    req.locale = req.acceptsLanguages(locales) || 'en';
    log('Detected locale from accept-language: %s', req.locale);
  }
  next();
}
