/* eslint no-var: 0, no-console: 0 */

import express from "express";
import consolidate from "consolidate";
import serveStatic from "serve-static";
import path from "path";
import url from "url";
import merge from "lodash/object/merge";
import object from "lodash/array/object";
import pluck from "lodash/collection/pluck";
import auth from "basic-auth";
import favicon from "serve-favicon";
import Fetchr from "fetchr";
import bodyParser from "body-parser";
import { capitalize } from "lodash";

import Promise from "bluebird";

import HtmlDocument from "../../app/shared/components/HtmlDocument";
import * as services from "../services";

import config from "../../config";

import { uploadImageMiddleware, deleteImageMiddleware } from "./services/images";

var oauth = require("./auth/oauth"),
  ShoutitClient = require("./resources"),
  apiRouter = require("./routes"),
  resetPass = require("./services/resetPassword"),
  verifyEmail = require("./services/verifyEmail");

var React = require("react"),
  ReactRouter = require("react-router"),
  ReactDOMServer = require("react-dom/server");

var Flux = require("../shared/flux"),
  routes = require("../shared/routes"),
  DocumentTitle = require("react-document-title");

// middleware
var morgan = require("morgan"),
  methodOverride = require("method-override"),
  session = require("express-session"),
  RedisStore = require("connect-redis")(session),
//csurf = require('csurf'),
  compression = require("compression"),
  cors = require("cors");

var graphData = require("./resources/consts/graphData");
var currencies, categories, sortTypes;
var whitelist = [
  "https://shoutit.com",
  "https://www.shoutit.com",
  "http://stage.www.shoutit.com",
  "http://beta.www.shoutit.com",
  "http://shoutit.dev"
];
if (process.env.NODE_ENV === "development") {
  whitelist.push("http://${config.host}");
}
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};


function updateCurrencies() {
  ShoutitClient.misc().currencies()
    .on("complete", (result, resp) => {
      if (result instanceof Error || resp.statusCode !== 200) {
        console.error("Cannot fetch currencies.", result);
        return;
      }
      currencies = object(pluck(result, "code"), result);
    });
}
updateCurrencies();

function updateCategories() {
  ShoutitClient.misc().categories()
    .on("complete", (result, resp) => {
      if (result instanceof Error || resp.statusCode !== 200) {
        console.error("Cannot fetch categories.", result);
        return;
      }
      categories = result;
    });
}
updateCategories();

ShoutitClient.misc().sortTypes()
  .on("complete", function (result, resp) {
    if (result instanceof Error || resp.statusCode !== 200) {
      console.error("Cannot fetch currencies.");
    } else {
      sortTypes = object(pluck(result, "type"), pluck(result, "name"));
      console.log("Fetched " + result.length + " sortTypes.");
    }
  });


function fetchData(userSession, routes, params, query) {
  var data = {};
  //return Promise.resolve(data);
  return Promise.all(routes.filter(function (route) {
    return route.component? route.component.fetchData: false;
  }).map(function (route) {
    return new Promise(function (resolve) {
      route.component.fetchData(ShoutitClient, userSession, params, route.name, query)
        .on("complete", function (result, resp) {
          if (result instanceof Error || resp.statusCode !== 200) {
            resolve({});
          } else {
            resolve(result);
          }
        });
    }).then(function (fetched) {
      data[route.component.fetchId] = fetched;
      console.log("Server Rendering data fetched for %s", route.component.fetchId);
    });
  })).then(function () {
    return data;
  });
}


function getMetaFromData(relUrl, data) {
  var addData;
  const urlPathName = url.parse(relUrl).pathname.split("/")[1];

  switch (urlPathName) {
  case "shout":
    const { shout } = data;
    if (shout) {
      addData = {
        type: "shout",
        shoutTypePrefix: capitalize(shout.type),
        ogType: "shoutitcom:" + shout.type,
        title: shout.title + " - Shoutit",
        image: shout.thumbnail,
        user: shout.user.name,
        description: capitalize(shout.type) + " by " + shout.user.name + ": " + shout.text,
        price: shout.price ? shout.price + " " + shout.currency : "",
        location: shout.location.city + " - " + shout.location.country
      };
    }
    break;
  case "user":
    const { user } = data;
    if (user) {
      addData = {
        type: "user",
        ogType: "shoutitcom:user",
        title: user.name,
        image: user.image
      };
    }
    break;
  default:
    addData = {
      type: "home",
      image: url.resolve(config.siteUrl, graphData.image)
    };
  }
  return merge({
    url: url.resolve(config.siteUrl, relUrl)
  }, graphData, addData);
}

function reactServerRender(req, res) {

  var user = req.session ? req.session.user : null;

  const fetchr = new Fetchr({ xhrPath: "/fetchr", req });

  // Run router to determine the desired state
  ReactRouter.match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    if (error) {
      res.status(500).send(error.message);
      return;
    }
    if (!renderProps) {
      res.status(404).send("Not found");
      return;
    }

    fetchData(req.session, renderProps.routes, renderProps.params, renderProps.location.query)
      .then(data => {

        const flux = new Flux(null, user, data, renderProps.params, currencies, categories, sortTypes);

        flux.service = fetchr;

        const state = flux.serialize();

        const content = ReactDOMServer.renderToString(
          <ReactRouter.RoutingContext
            createElement={ (Component, props) => <Component {...props} flux={ flux } /> }
            {...renderProps}
          />
        );

        var meta = getMetaFromData(req.url, data);

        const html = ReactDOMServer.renderToStaticMarkup(
          <HtmlDocument
            content={ content }
            state={ state }
            title={ DocumentTitle.rewind() }
            meta={ meta }
          />
        );

        res.send(`<!doctype html>${html}`);

      });

  });

}

var redisOptions = {
  db: 11
};

redisOptions.host = process.env.REDIS_HOST;

function detectionMiddleware(req, res, next) {
  var ua = req.headers["user-agent"],
    $ = {};

  if (/mobile/i.test(ua)) {
    $.Mobile = true;
  }

  if (/like Mac OS X/.test(ua)) {
    $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, ".");
    if (/iPhone/.test(ua)) {
      $.iPhone = /iPhone/.test(ua);
    }
    if (/iPad/.test(ua)) {
      $.iPad = /iPad/.test(ua);
    }
  }

  if (/Android/.test(ua)) {
    $.Android = /Android( )?(; (Tablet|Mobile); rv:)?([0-9\.]+)[\);]/.exec(ua)[4];
  }

  if (/webOS\//.test(ua)) {
    $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
  }

  if (/(Intel|PPC) Mac OS X/.test(ua)) {
    $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, ".") || true;
  }

  if (/Windows NT/.test(ua)) {
    $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
  }

  req.devices = $;

  next();
}

module.exports = function (app) {
  // view stuff
  app.engine("jade", consolidate.jade);
  app.set("view engine", "jade");
  app.set("views", path.join(__dirname, "views"));

  app.use(bodyParser.json({limit: "5mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

  // CORS Protection
  app.use(cors(corsOptions));

  // gzip it
  app.use(compression());

  app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

  if (process.env.NODE_ENV === "production") {
    app.use(favicon("./public/images/favicons/favicon.ico"));
  } else {
    app.use(favicon("./assets/images/favicons/favicon.ico"));
  }

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({
    store: new RedisStore(redisOptions),
    secret: "ShoutItOutLoudIntoTheCrowd",
    resave: false,
    saveUninitialized: true
  }));

  if (process.env.BASIC_AUTH_USERNAME && process.env.BASIC_AUTH_PASSWORD) {

    app.use((req, res, next) => {
      var credentials = auth(req);

      if (!credentials ||
          credentials.name !== process.env.BASIC_AUTH_USERNAME ||
          credentials.pass !== process.env.BASIC_AUTH_PASSWORD) {
        res.statusCode = 401;
        res.setHeader(`WWW-Authenticate`, `Basic realm="shoutit"`);
        res.end("Access denied");
      }
      else {
        next();
      }
    });

  }

  Object.keys(services).forEach(name => Fetchr.registerService(services[name]) );
  app.use("/fetchr", Fetchr.middleware());

  const maxAge = 365 * 24 * 60 * 60;

  if (process.env.NODE_ENV === "production") {
    app.use("/scripts", serveStatic("./public/scripts", { maxAge }));
    app.use("/images", serveStatic("./public/images", { maxAge }));
    app.use("/styles", serveStatic("./public/styles", { maxAge }));
  }
  else {
    app.use("/images", serveStatic("./assets/images", { maxAge }));
  }

  // TODO Add csrf tokens to the webapp
  //app.use(csurf());

  var authRouter = new express.Router();

  authRouter.post("/gplus", oauth.gplusAuth);
  authRouter.post("/fb", oauth.fbAuth);
  authRouter.post("/shoutit", oauth.siAuth);
  authRouter.get("/logout", oauth.logout);
  authRouter.post("/signup", oauth.signup);
  authRouter.post("/forget", oauth.forgetPass);

  // Services router
  var servicesRouter = new express.Router();

  servicesRouter.get("/reset_password", resetPass.get);
  servicesRouter.post("/reset_password", resetPass.post);
  servicesRouter.get("/verify_email", verifyEmail);

  servicesRouter.post("/images/:resourceType", uploadImageMiddleware);
  servicesRouter.delete("/images", deleteImageMiddleware);

  app.use("/auth", authRouter);
  app.use("/services", servicesRouter);
  app.use("/api", apiRouter);

  //Redirect all trailing slashes
  app.use(function (req, res, next) {
    if (req.path.substr(-1) == "/" && req.path.length > 1) {
      var query = req.url.slice(req.path.length);
      res.redirect(301, req.path.slice(0, -1) + query);
    } else {
      next();
    }
  });

  // Adding user agent to a global navigator (will be used by material-ui components)
  app.use(function(req, res, next) {
    GLOBAL.navigator = {
      userAgent: req.headers["user-agent"]
    };
    next();
  });

  // Redirects
  app.use("/s/:shoutId", function (req, res) {
    res.redirect("/shout/" + req.params.shoutId);
  });

  app.use("/u/:username", function (req, res) {
    res.redirect("/user/" + req.params.username);
  });

  app.use("/t/:tagName", function (req, res) {
    res.redirect("/tag/" + req.params.tagName);
  });

  app.use("/m/:msgId", function (req, res) {
    res.redirect("/message/" + req.params.msgId);
  });

  app.use("/profile", function (req, res) {
    var user = req.session ? req.session.user : null;

    if (user && user.username) {
      res.redirect("/user/" + user.username);
    } else {
      res.redirect("/login");
    }
  });

  app.use("/search/:term/shouts", function shoutSearchRedirect(req, res) {
    res.redirect("/search/" + req.params.term);
  });

  app.use("/messages/?*", function redirectNotLoggedUser(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  app.use("/app", detectionMiddleware, function (req, res) {
    console.log(req.devices);

    if (req.devices) {
      if (req.devices.iOS || req.devices.iPhone || req.devices.iPad) {
        console.log("Detected iOS Device");
        res.redirect("https://geo.itunes.apple.com/de/app/shoutit-app/id947017118?mt=8");
      } else if (req.devices.Android) {
        console.log("Detected Android Device");
        res.redirect("https://play.google.com/store/apps/details?id=com.shoutit.app.android");
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  }
  );

  // Catch SMS Code registry
  var smsCodeRegex = /^(z|Z)[a-zA-Z0-9]{5,9}/;
  app.use("/:smsCode", function redirectSMSCode(req, res, next) {
    if (req.params.smsCode && req.params.smsCode.match(smsCodeRegex)) {
      oauth.sms(req, req.params.smsCode)
        .then(function (user) {
          ShoutitClient.users().getShouts(req.session, user.username)
            .on("complete", function (result, resp) {
              if (result instanceof Error || resp.statusCode !== 200) {
                next(result);
              } else {
                var firstShout = result.results[0];
                res.redirect("/shout/" + firstShout.id);
              }
            });
        }, function () {
          res.redirect("/");
        });
    } else {
      next();
    }
  });

  app.get("*", reactServerRender);
};
