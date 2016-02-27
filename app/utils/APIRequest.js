/* eslint no-console: 0 */

/**
 * Extends superagent for supporting shoutit access token authorization and to
 * prefix endpoints with the complete API url
 *
 * Example
 *
 * 		request
 * 			.get("/user/ABC")                  // will request https://api.shoutit.com/v2/user/ABC
 * 		 	.setSession({ accessToken: "foo"}) // set the authorization header using `accessToken` (optional)
 * 		  .end( (err, res) => {              // usual superagent stuff
 * 		  	if (err) {
 * 		  		console.error(err);            // BEWARE! Error will be the response if response status > 300
 * 		  																	 // (this is the default behaviour of superagent 1+).
 * 		  	}
 * 		  }
 */

import request from "superagent";
import debug from "debug";
import config from "../../config";

const apiUrl = config.apiUrl.replace(/\/$/, ""); // remove trailing / at the end of the url
const log = debug("shoutit:server:request");

request.Request.prototype.setSession = function(session) {
  this.session = session;
  return this;
};

const oldEnd = request.Request.prototype.end;
request.Request.prototype.end = function(callback) {
  this.end = oldEnd;
  this.url = `${apiUrl}${this.url}`;

  const newCallback = (err, res) => {
    if (err || !res.ok) {
      console.error(err || res);
      log("Error from request %s", err);
      callback(err || res);
      return;
    }
    log("Successful request to %s", this.url, res.body);
    callback(null, res);
  };

  if (this.session && this.session.accessToken) {
    this.set("Authorization", `Bearer ${this.session.accessToken}`);
    log("Authorization token has been set");
  }
  log("Sending request to %s...", this.url);
  return this.end.call(this, newCallback);
};

export default request;
