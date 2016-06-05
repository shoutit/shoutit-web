import debug from 'debug';
import { locales } from '../config';
const log = debug('shoutit:server:localeMiddleware');

export default function localeMiddleware(req, res, next) {
  req.locale = req.acceptsLanguages(locales) || 'en';
  log('Detected locale: %s', req.locale);
  next();
}
