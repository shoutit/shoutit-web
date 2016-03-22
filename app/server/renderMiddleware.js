import React from "react";
import { match, RouterContext } from "react-router";
import ReactDOMServer from "react-dom/server";
import DocumentTitle from "react-document-title";
import Fetchr from "fetchr";
import debug from "debug";

import HtmlDocument from "./HtmlDocument";
import Flux from "../Flux";
import routes from "../routes";

import { Provider } from "react-redux";
import configureStore from "../store/configureStore";

import fetchDataForRoutes from "../utils/fetchDataForRoutes";

const log = debug("shoutit:server");

export default function renderMiddleware(req, res, next) {

  const fetchr = new Fetchr({ xhrPath: "/fetchr", req });
  const flux = new Flux(fetchr);

  const store = configureStore({
    routing: { currentUrl: req.url }
  }, { fetchr });

  // Run router to determine the desired state
  match({ routes, location: req.url }, (error, redirectLocation, props) => {

    log("Matched request for %s", req.url);

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

    log("Fetching data for routes...");

    fetchDataForRoutes(props.routes, props.params, req.query, store, err => {
      if (err) {
        return next(err);
      }
      log("Routes data has been fetched");
      const state = flux.dehydrate();
      props.query = req.query;
      const content = ReactDOMServer.renderToString(
        <Provider store={ store }>
          <RouterContext createElement={ (Component, props) => <Component {...props} query={ req.query } flux={ flux } /> } {...props}  />
        </Provider>
      );

      const meta = {}; // getMetaFromData(req.url, data);
      const initialState = store.getState();
      log("Initial store state", initialState);
      const html = ReactDOMServer.renderToStaticMarkup(
        <HtmlDocument
          content={ content }
          state={ state }
          initialState={ initialState }
          title={ DocumentTitle.rewind() }
          meta={ meta }
        />
      );
      res.send(`<!doctype html>${html}`);
    });

  });

}
