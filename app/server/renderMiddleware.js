import React from "react";
import { match, RouterContext } from "react-router";
import ReactDOMServer from "react-dom/server";
import DocumentTitle from "react-document-title";
import Fetchr from "fetchr";

import HtmlDocument from "./HtmlDocument";
import Flux from "../Flux";
import routes from "../routes";

import { fetchDataForRoutes } from "../utils/FluxUtils";

export default function renderMiddleware(req, res, next) {

  const fetchr = new Fetchr({ xhrPath: "/fetchr", req });
  const flux = new Flux(fetchr);

  // Run router to determine the desired state
  match({ routes, location: req.url }, (error, redirectLocation, props) => {

    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    if (error) {
      next(error);
      return;
    }
    if (!props) {
      // ???
      res.status(404).send("Not found");
      return;
    }

    fetchDataForRoutes(props.routes, props.params, req.query, flux, err => {
      if (err) {
        return next(err);
      }
      const state = flux.dehydrate();

      try {
        const content = ReactDOMServer.renderToString(
          <RouterContext
            createElement={ (Component, props) => <Component {...props} flux={ flux } /> }
            {...props}
          />
        );

        const meta = {}; // getMetaFromData(req.url, data);

        const html = ReactDOMServer.renderToStaticMarkup(
          <HtmlDocument
            content={ content }
            state={ state }
            title={ DocumentTitle.rewind() }
            meta={ meta }
          />
        );
        res.send(`<!doctype html>${html}`);
      } catch (e) {
        next(e);
      }
    });

  });

}
