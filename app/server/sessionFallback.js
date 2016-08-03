/* eslint no-console: 0 */

export default function sessionFallback(sessionMiddleware) {
  return function sessionFallbackMiddleware(req, res, next) {
    if (req.session) {
      return next();
    }

    return sessionMiddleware(req, res, next);
  };
}
