/* eslint no-param-reassign: 0 */
/**
 * Augment an express request object with session data
 * @param  {Object} req
 * @param  {Object} sessionData The object coming from a API access token request
 */
export function createRequestSession(req, sessionData) {
  req.session.user = sessionData.user;
  req.session.accessToken = sessionData.access_token;
  req.session.refreshToken = sessionData.refresh_token;
  req.session.cookie.expires = new Date(Date.now() + parseInt(sessionData.expires_in, 10));
  req.session.scope = sessionData.scope ? sessionData.scope.split[' '] : [];
}
