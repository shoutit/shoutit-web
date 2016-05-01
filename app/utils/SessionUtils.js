/* eslint no-param-reassign: 0, no-console: 0 */

export function createRequestSession(req, sessionData) {
  if (!req.session) {
    console.error('Error: req.session is not available - is redis running?');
    throw (new Error('Session not ready'));
  }
  req.session.user = sessionData.user;
  req.session.accessToken = sessionData.access_token;
  req.session.refreshToken = sessionData.refresh_token;
  req.session.cookie.expires = new Date(Date.now() + parseInt(sessionData.expires_in, 10));
  req.session.scope = sessionData.scope ? sessionData.scope.split[' '] : [];
}
