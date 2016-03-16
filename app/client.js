/* eslint no-console: 0 */
/* eslint-env browser */

import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import injectTapEventPlugin from "react-tap-event-plugin";
import useScroll from "scroll-behavior/lib/useStandardScroll";
import createHistory from "history/lib/createBrowserHistory";
import debug from "debug";
import Fetchr from "fetchr";
import "babel-polyfill";

import * as config from "./config";

import routes from "./routes";
import Flux from "./Flux";

import "./client/initFacebook";
import initGoogleAnalytics from "./client/initGoogleAnalytics";
import { setupPusher } from "./client/pusher";

import "styles/main.scss";

injectTapEventPlugin();

window.debug = debug;
const log = debug("shoutit");

const fetchr = new Fetchr({ xhrPath: "/fetchr", xhrTimeout: 20000 });
const flux = new Flux(fetchr);

flux.setDispatchInterceptor((action, dispatch) =>  {
  ReactDOM.unstable_batchedUpdates(() => dispatch(action));
});

if (window.__state) {
  flux.rehydrate(window.__state);
  log("Flux stores has been rehydrated");
}
else {
  console.warn("No data to rehydrate in the flux stores");
}

flux.on("dispatch", (type, payload) =>
  debug("shoutit:flux")("Dispatching %s", type, payload)
);

let ga;
if (config.ga) {
  ga = initGoogleAnalytics(config.ga);
}

if (window.google) {
  const locationStore = flux.store("locations");
  locationStore.setGMaps(window.google.maps);
}

setupPusher(flux.store("auth"), {
  onNewMessage: (message) => {
    if (flux.store("conversations").get(message.conversation_id)) {
      flux.actions.newPushedMessage(message);
    }
    else {
      flux.actions.loadConversations();
    }
  }
});

log("Starting client web app", `\n${config.getSummary()}\n`);

ReactDOM.render(
  <Router
    history={useScroll(createHistory)()}
    createElement={ (Component, props) =>
      <Component {...props} flux={flux} />
    }>
    { routes }
  </Router>,
  document.getElementById("content"),
  () => {
    log("App has been mounted");
    if (ga) {
      ga("send", "pageview", window.location.href);
    }
  }
);
