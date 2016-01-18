/* eslint no-console: 0 */
/* eslint-env browser */

import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import isMobile from "ismobilejs";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "../shared/routes.jsx";
import Flux from "../shared/flux";
import facebook from "./fb";
import gAnalytics from "./ga";
import pusher from "./pusher";
import createBrowserHistory from "history/lib/createBrowserHistory";

import "styles/main.scss";

injectTapEventPlugin();

const envData = {};

envData.mobile = isMobile.any;

const flux = new Flux(null);

if (window.fluxData) {
  flux.hydrate(window.fluxData);
  document.body.replaceChild(document.createElement("script"), document.getElementById("fluxData"));
}

flux.on("dispatch", function (type, payload) {
  console.log("[Flux]", type, payload);
});

// Facebook init
facebook("353625811317277");

// Google Analytics init
const ga = gAnalytics("UA-62656831-1");

// setting google maps
if(window.google) {
  const locationStore = flux.store("locations");
  locationStore.setGMaps(window.google.maps);
}

// Pusher Service
const pusherClient = pusher("86d676926d4afda44089", "/api/pusher/auth");

const usersStore = flux.store("users");
const loggedUser = usersStore.getLoggedUser();

if (loggedUser) {
  envData.user = loggedUser;
}

pusherClient.subscribeUser(flux, loggedUser);

usersStore.on("login", function () {
  envData.user = usersStore.getLoggedUser();
  pusherClient.subscribeUser(flux, usersStore.getLoggedUser());
});

usersStore.on("logout", function () {
  envData.user = null;
  pusherClient.unsubscribeUser();
});

ReactDOM.render(
  <Router
    history={createBrowserHistory()}
    createElement={(Component, props) => <Component {...props} flux={flux} /> }>
    { routes(envData) }
  </Router>,
  document.getElementById("root"),
  () => ga("send", "pageview", window.location.href)
);
