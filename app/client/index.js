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

import routes from "../shared/routes";
import Flux from "../shared/flux";
import "../client/initializeFacebook";
import gAnalytics from "../client/ga";
import { setup as setupPusher } from "../client/pusher";
import config from "../../config";

import "babel-core/polyfill";

import "styles/main.scss";

injectTapEventPlugin();

window.debug = debug;
const log = debug("shoutit");

const flux = new Flux(null);
flux.service = new Fetchr({ xhrPath: "/fetchr", xhrTimeout: 20000 });

flux.setDispatchInterceptor((action, dispatch) =>  {
  ReactDOM.unstable_batchedUpdates(() => dispatch(action));
});

if (window.fluxData) {
  flux.hydrate(window.fluxData);
  log("Flux stores has been rehydrated", window.fluxData);
}
else {
  console.warn("No data to rehydrate in the flux stores");
}

flux.on("dispatch", (type, payload) =>
  debug("shoutit:flux")("Dispatching %s", type, payload)
);

let ga;
if (config.ga) {
  ga = gAnalytics(config.ga);
}

if (window.google) {
  const locationStore = flux.store("locations");
  locationStore.setGMaps(window.google.maps);
}

setupPusher(flux.store("users"), {
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
    createElement={ (Component, props) => {
      // Save previous location to know if history.back() can work –
      // should be placed in an external utility
      window.previousLocation = props.location;
      return <Component {...props} flux={flux} />;
    } }>
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
