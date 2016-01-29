/* eslint no-console: 0 */
/* eslint-env browser */

import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "../shared/routes.jsx";
import Flux from "../shared/flux";
import facebook from "../client/fb";
import gAnalytics from "../client/ga";
import setupPusherClient from "../client/setupPusherClient";
import createBrowserHistory from "history/lib/createBrowserHistory";

import "styles/main.scss";

injectTapEventPlugin();

const flux = new Flux(null);

if (window.fluxData) {
  flux.hydrate(window.fluxData);
  document.body.replaceChild(
    document.createElement("script"),
    document.getElementById("fluxData")
  );
}

if (process.env.NODE_ENV === "development") {
  flux.on("dispatch", function (type, payload) {
    console.log("[Flux]", type, payload);
  });
}

facebook("353625811317277");
const ga = gAnalytics("UA-62656831-1");

if(window.google) {
  const locationStore = flux.store("locations");
  locationStore.setGMaps(window.google.maps);
}

setupPusherClient(flux.store("users"), {
  onNewMessage: message => console.log(message)
});

ReactDOM.render(
  <Router
    history={createBrowserHistory()}
    createElement={(Component, props) => <Component {...props} flux={flux} /> }>
    { routes() }
  </Router>,
  document.getElementById("root"),
  () => ga("send", "pageview", window.location.href)
);
