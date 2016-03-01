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

import request from "superagent";
import debug from "debug";
import config from "../../config";

const apiUrl = config.apiUrl.replace(/\/$/, ""); // remove trailing / at the end of the url
const log = debug("shoutit:server:request");

request.Request.prototype.setSession = function(session) {
  if (session && session.accessToken) {
    this.set("Authorization", `Bearer ${session.accessToken}`);
    log("Authorization token has been set");
  }
  return this;
};

/**
 * Prefix url request with `prefix`
 * @param  {String} prefix=apiUrl Default is API url from config
 * @return {Request}
 */
request.Request.prototype.prefix = function(prefix=apiUrl) {
  this.url = `${prefix}${this.url}`;
  return this;
};

export default request;
