/* eslint no-console: 0 */

import newrelic, { newrelicEnabled } from './newrelic';
import debug from 'debug';

const log = debug('shoutit:server:sessionFallbackMiddleware');

export default function sessionFallback(sessionMiddleware) {
  return function sessionFallbackMiddleware(req, res, next) {
    if (req.session) {
      return next();
    }

    const error = 'redis connection failed! Falling back to request sessions.';
    log(error);

    if (newrelicEnabled) {
      newrelic.noticeError(error);
    }

    return sessionMiddleware(req, res, next);
  };
}
