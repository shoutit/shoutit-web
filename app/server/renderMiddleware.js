import url from "url";
import React from "react";
import { match, RoutingContext } from "react-router";
import ReactDOMServer from "react-dom/server";
import DocumentTitle from "react-document-title";
import Fetchr from "fetchr";
import { capitalize, merge } from "lodash";
import { getVariation } from "../utils/APIUtils";
import * as config from "./config";
import * as graphData from "./resources/consts/graphData";

import HtmlDocument from "./server/HtmlDocument";
import Flux from "../Flux";
import routes from "../routes";
import ShoutitClient from "./resources";

function fetchData(userSession, routes, params, query) {
  const data = {};
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
    });
  })).then(function () {
    return data;
  });
}

function getMetaFromData(relUrl, data) {
  let addData;
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
        image: shout.thumbnail ? getVariation(shout.thumbnail) : null,
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
        image: getVariation(user.image)
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

export default function renderMiddleware(req, res, next) {
  const loggedUser = req.session ? req.session.user : null;

  const fetchr = new Fetchr({ xhrPath: "/fetchr", req });

  // Run router to determine the desired state
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {

    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    if (error) {
      next(error);
      return;
    }
    if (!renderProps) {
      // ???
      res.status(404).send("Not found");
      return;
    }

    fetchData(req.session, renderProps.routes, renderProps.params, renderProps.location.query)
      .then(data => {

        const initialStoreStates = {
          auth: { loggedUsername: loggedUser ? loggedUser.username : null },
          discovers: { ...data},
          locations: { ...data, params: renderProps.params },
          search: { ...data, categories },
          shouts: { ...data, currencies, categories, sortTypes },
          tags: { ...data },
          users: { loggedUser, ...data }
        };

        const flux = new Flux(initialStoreStates, fetchr);
        const state = flux.dehydrate();
        const content = ReactDOMServer.renderToString(
          <RoutingContext
            createElement={ (Component, props) => <Component {...props} flux={ flux } /> }
            {...renderProps}
          />
        );

        const meta = getMetaFromData(req.url, data);

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
