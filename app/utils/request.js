/*
 * Extends superagent for supporting shoutit access token authorization and to
 * prefix endpoints with the complete API url
 *
 * Example
 *
 * 		request
 * 			.get("/user/ABC")                  // will request https://api.shoutit.com/v2/user/ABC
 * 		 	.use({ session: { accessToken: "foo" }}) // set the authorization header using `accessToken` (optional)
 * 		 	.prefix()                                 // prefix the endpoint with API URL
 * 		  .end(callback)
 */

import request from 'superagent';
import debug from 'debug';
import { apiUrl } from '../config';

const log = debug('shoutit:utils:request');

// Use data from the server-side request object
request.Request.prototype.use = function use(req) {
  if (req.session && req.session.accessToken) {
    this.set('Authorization', `Bearer ${req.session.accessToken}`);
  }
  if (req.language) {
    this.set('Accept-Language', req.language);
  }

  if (req.headers) {
    this.set('X-Forwarded-For', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  }

  let userAgent = `shoutit-web (nodejs ${process.version}; ${process.env.NODE_ENV}; ${process.env.SHOUTIT_ENV || 'no-env'}; ${process.env.CURRENT_TAG})`;
  if (req.headers && req.headers['user-agent']) {
    userAgent += ` ${req.headers['user-agent']}`;
  }
  this.set('User-Agent', userAgent);
  return this;
};

const oldEnd = request.Request.prototype.end;

// Add some logs to the end method
request.Request.prototype.end = function end(oldCallback) {
  this.end = oldEnd;
  const callback = (err, res) => {
    oldCallback(err, res);
    if (res) {
      log('Done %s %s from %s', res.status, this.method, this.url);
    }
    if (err) {
      console.error("Error %s %s from %s: %s", res ? res.status : "(no HTTP status)", this.method, this.url, err.message); // eslint-disable-line
    }
  };
  log('Started %s to %s...', this.method, this.url, this.toJSON(), this.qs);
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
