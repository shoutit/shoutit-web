/**
 * Created by Philip on 12.01.2015.
 */
import { apiUrl } from "../../../config";

var url = require("url");

var Promise = require("bluebird"),
  request = require("superagent");

var ENDPOINT_SERVER = apiUrl,
  ACCESSTOKEN_ENDPOINT = "oauth2/access_token",
  USER_ENDPOINT = "users/me",
  CLIENT_ID = "shoutit-web",
  CLIENT_SECRET = "0db3faf807534d1eb944a1a004f9cee3",
  GRANT_TYPES = {
    gplus: "gplus_code",
    fb: "facebook_access_token",
    shoutit:"shoutit_login",
    signup: "shoutit_signup",
    refresh: "refresh_token",
    sms: "sms_code"
  };

function requestAccessToken(type, grantToken) {
  var requestData = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: GRANT_TYPES[type]
  };

  if(GRANT_TYPES[type] === "shoutit_login") {
    requestData.email = grantToken.email;
    requestData.password = grantToken.pass;
  }
  else { // fb and gplus
    requestData[GRANT_TYPES[type]] = grantToken;
  }

  //console.log(requestData);
  //console.log(url.resolve(ENDPOINT_SERVER,  ACCESSTOKEN_ENDPOINT));

  return new Promise(function (resolve, reject) {
    request
      .post(url.resolve(ENDPOINT_SERVER, ACCESSTOKEN_ENDPOINT))
      .type("json")
      .accept("json")
      .send(requestData)
      .end(function (err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res.body);
      });
  });
}

function updateSession(req) {
  return function (resp) {
    var accessToken = req.session.accessToken = resp.access_token;
    req.session.refreshToken = resp.refresh_token;
    req.session.cookie.expires = new Date(Date.now() + parseInt(resp.expires_in));
    req.session.scope = resp.scope ? resp.scope.split[" "] : [];
    return accessToken;
  };
}

function fetchUser(accessToken) {
  return new Promise(function (resolve, reject) {
    request
      .get(ENDPOINT_SERVER + USER_ENDPOINT)
      .set("Authorization", "Bearer " + accessToken)
      .accept("json")
      .end(function (err, resp) {
        if (err) {
          reject(err);
        } else {
          if (resp.body.id) {
            resolve(resp.body);
          } else {
            reject(resp.body);
          }
        }
      });
  });
}

function auth(type) {
  return function (req, res) {
    var code = req.body.token || {email:req.body.email,pass:req.body.pass};
    if (code) {
      requestAccessToken(type, code)
        .then(updateSession(req))
        .then(fetchUser)
        .then(function (user) {
          req.session.user = user;
          res.json(user);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    } else {
      res.status(400).send("Bad Request");
    }
  };
}

module.exports = {
  gplusAuth: auth("gplus"),
  fbAuth: auth("fb"),
  siAuth: auth("shoutit"),

  sms: function (req, smsCode) {
    return requestAccessToken("sms", smsCode)
      .then(updateSession(req))
      .then(fetchUser)
      .then(function (user) {
        req.session.user = user;
        return Promise.resolve(user);
      });
  }


};
