/*
 * Extends superagent for supporting shoutit access token authorization and to
 * prefix endpoints with the complete API url
 *
 * Example
 *
 * 		request
 * 			.get("/user/ABC")                  // will request https://api.shoutit.com/v2/user/ABC
 * 		 	.setSession({ accessToken: "foo"}) // set the authorization header using `accessToken` (optional)
 * 		 	.prefix()                          // prefix the endpoint with API URL
 * 		  .end(callback)
 */

import request from 'superagent';
import debug from 'debug';
import { apiUrl } from '../config';

const log = debug('shoutit:request');

request.Request.prototype.setSession = function setSession(session) {
  if (session && session.accessToken) {
    this.set('Authorization', `Bearer ${session.accessToken}`);
  }
  return this;
};

const oldEnd = request.Request.prototype.end;

request.Request.prototype.end = function end(oldCallback) {
  this.end = oldEnd;
  const callback = (err, res) => {
    oldCallback(err, res);
    if (err) {
      console.error("Error %s %s from %s: %s", res ? res.status : "(no HTTP status)", this.method, this.url, err.message); // eslint-disable-line
    } else {
      log('Done %s %s from %s', res.status, this.method, this.url);
    }
  };
  log('Started %s to %s...', this.method, this.url, this.qs);
  return this.end.call(this, callback);
};

/**
 * Prefix url request with `prefix`
 * @param  {String} prefix=apiUrl Default is API url from config
 * @return {Request}
 */
request.Request.prototype.prefix = function prefix(prefix = apiUrl) {
  if (this.url.indexOf(apiUrl) === -1) {
    this.url = `${prefix}${this.url}`;
  }
  return this;
};

export default request;
