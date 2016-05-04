/* eslint no-param-reassign: 0, no-console: 0 */
import debug from 'debug';

const log = debug('shoutit:createSessionFromAPIResponse');

export function createSessionFromAPIResponse(req, data) {
  const { profile, accessToken, refreshToken, scope } = data;
  req.session.user = profile;
  req.session.accessToken = accessToken;
  req.session.refreshToken = refreshToken;
  req.session.cookie.expires = new Date(Date.now() + parseInt(data.expiresIn, 10));
  req.session.scope = scope ? scope.split[' '] : [];
  log('Session has been created', req.session);
}
