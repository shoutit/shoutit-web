var Promise = require("bluebird"),
        request = require("superagent"),
        url = require("url");

var ENDPOINT_SERVER = process.env.API_URL,
        EMAIL_VERIFY_ENDPOINT = "auth/verify_email";

function checkToken(query) {  
        return new Promise(function(resolve,reject) {
          request
      .get(url.resolve(ENDPOINT_SERVER,EMAIL_VERIFY_ENDPOINT))
      .accept("json")
      .query(query)
      .end(function(err, res) {
              if(err) {
                reject(err.error);
        } else {
                resolve(res.body);
        }
      });
  });
}

function checkErrors(resp) {
        var err = {};
        err.msg = resp.error || resp.success || undefined;

        return new Promise(function(resolve,reject) {
          if(err.msg) {
            reject(err.msg);
    } else if(resp.access_token) {
            resolve(resp);
    }
  });
}

function setSession(req) {
        return function(resp) {
          var accessToken = req.session.accessToken = resp.access_token;
          req.session.refreshToken = resp.refresh_token;
          req.session.cookie.expires = new Date(Date.now() + parseInt(resp.expires_in));
          req.session.scope = resp.scope ? resp.scope.split[" "] : [];
          return resp;
  };
}

function authToken(req, res) {
        if (req.query.verify_token) {
          var apiQuery = {token: req.query.verify_token};
          checkToken(apiQuery)
      .then(checkErrors)
      .then(setSession(req))
      .then(function(resp) {
              res.json(resp.user);
      })
      .catch(function(err) {
              res.status(500).json(err);
      });
  } else {
          res.send("Invalid token!");
  }
}

module.exports = authToken;
