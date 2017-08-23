/* eslint no-underscore-dangle: 0 */

/*
 * Extends superagent for supporting shoutit access token authorization and to
 * prefix endpoints with the complete API url
 *
 * Example
 *
 * 		request
 * 			.get("/user/ABC")                         // will request https://api.shoutit.com/v2/user/ABC
 * 		 	.use({ session: { accessToken: "foo" }})  // set the authorization header using `accessToken` (optional)
 * 		 	.prefix()                                 // prefix the endpoint with API URL
 *      .camelizeResponseBody()                   // camelize the body response keys
 * 		  .end(callback)
 */
import request from 'superagent';
import { camelizeKeys } from 'humps';
import debug from 'debug';
import { apiUrl } from '../config';

const log = debug('shoutit:utils:request');

// Use data from the server-side request object
request.Request.prototype.use = function use(req) {

  if (req.session) {
    if (req.session.accessToken) {
      this.set('Authorization', `Bearer ${req.session.accessToken}`);
    }
    if (req.session.page) {
      this.set('Authorization-Page-Id', req.session.page.id);
    }
    if (req.session.language) {
      this.set('Accept-Language', req.session.language);
    }
  }

  if (req.headers) {
    this.set('X-Forwarded-For', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  }

  let userAgent = `shoutit-web (nodejs ${process.version}; ${process.env.NODE_ENV}; ${process.env.CURRENT_TAG})`;
  if (req.headers && req.headers['user-agent']) {
    userAgent += ` ${req.headers['user-agent']}`;
  }
  this.set('User-Agent', userAgent);
  return this;
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

/**
 * Prefix url request with `prefix`
 * @param  {String} prefix=apiUrl Default is API url from config
 * @return {Request}
 */
request.Request.prototype.camelizeResponseBody = function camelizeResponseBody() {
  this._camelizeResponseBody = true;
  return this;
};


const oldEnd = request.Request.prototype.end;
// Add some logs to the end method
request.Request.prototype.end = function end(oldCallback) {
  this.end = oldEnd;
  const callback = (err, res) => {
    if (res.body) {
      if (this._camelizeResponseBody) {
        res.body = camelizeKeys(res.body);
      }
    }
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


export default request;
