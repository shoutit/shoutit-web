/* eslint-env browser */

import debug from 'debug';
import { now } from 'unix-timestamp';

const log = debug('shoutit:utils:FacebookUtils');

let appId;
let version;
if (process.env.NODE_ENV === 'development' || process.env.SHOUTIT_ENV === 'stage') {
  appId = '1151546964858487';
  version = 'v2.0';
} else {
  appId = '353625811317277';
  version = 'v2.0';
}

export function initFacebook(callback) {

  if (window.FB && callback) {
    log('Facebook SDK already loaded.');
    callback();
    return;
  }

  /* eslint-disable */
  window.fbAsyncInit = function () {
    log('Facebook SDK has been loaded.');
    window.FB.init({ appId, version });
    log('Facebook App: ' + appId + ' has been initialized.');
    if (callback) {
      callback();
    }
  };

  (function (d, s, id) {
    var js;
    var fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
 
}

export function isLinked(profile) {
  return !!profile.linkedAccounts && !!profile.linkedAccounts.facebook;
}

export function didTokenExpire(profile) {
  return isLinked(profile) && profile.linkedAccounts.facebook.expiresAt < now();
}

export function isScopeGranted(grantedScopes, requiredScopes) {
  if (typeof grantedScopes === 'string') {
    grantedScopes = grantedScopes.split(',');
  }
  if (typeof requiredScopes === 'string') {
    requiredScopes = requiredScopes.split(',');
  }
  return grantedScopes.every(
    scope => requiredScopes.indexOf(scope) > -1
  );
}

export function login(options, callback) {
  options = {
    ...options,
    scope: `email${options.scope ? `,${options.scope}` : ''}`,
    return_scopes: true,
  }
  log('Login with options', options);
  initFacebook(() => {
    window.FB.login(response => {
      log('Response received from FB SDK', response);
      const { authResponse } = response;
      if (!authResponse) {
        log('No auth response received!');
        return callback('FACEBOOK_NO_RESPONSE');
      }
      const grantedScopes = authResponse.grantedScopes.split(',');
      if (!isScopeGranted(options.scope, authResponse.grantedScopes)) {
        log('Invalid scopes');
        return callback('FACEBOOK_INVALID_SCOPE');
      }
      callback(null, response);
    }, options);

  });
}

export function getLoginStatus(callback) {
  log('Getting login status');
  initFacebook(() => {
    window.FB.getLoginStatus(response => {
      log('Login status received', response);
      callback(response);
    });
  });
}

export function hasScope(profile, scope) {
  if (!profile.linkedAccounts || !profile.linkedAccounts.facebook) {
    return false;
  }
  return profile.linkedAccounts.facebook.scopes.indexOf(scope) > -1;
}