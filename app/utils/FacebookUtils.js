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

export function didTokenExpire(profile) {
  if (!profile.linkedAccount || !profile.linkedAccount.facebook) {
    return false;
  }
  if (now() < profile.linkedAccount.facebook.expiresAt) {
    return false;
  }
  return true;
}

export function isScopeGranted(requiredScope, receivedScope) {
  requiredScope = requiredScope.split(',');
  receivedScope = receivedScope.split(',');

  return requiredScope.every(
    scope => receivedScope.indexOf(scope) > -1
  );
}

export function login(options, callback) {
  options = {
    scope: 'email',
    return_scopes: true,
    ...options,
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