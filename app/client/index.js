import React from 'react/addons';
import Router from 'react-router';

import routes from '../shared/routes.jsx';
import Flux from '../shared/flux';

import facebook from './fb';
import gAnalytics from './ga';
import geolocation from './geolocation';
import pusher from './pusher';

let envData = {};

let router = Router.create({
	routes: routes(envData),
	location: Router.HistoryLocation
});

let flux = new Flux(router);

if (window.fluxData) {
	flux.hydrate(window.fluxData);
	document.body.replaceChild(document.createElement('script'), document.getElementById('fluxData'));
}

flux.on("dispatch", function (type, payload) {
	if (console && console.log) {
		console.log("[Flux]", type, payload);
	}
});

// Facebook init
facebook("353625811317277");

// Google Analytics init
let ga = gAnalytics('UA-62656831-1');

// Maps Geolocation
geolocation(function (gmaps, pos) {
	let locationsStore = flux.store('locations');

	locationsStore.setGMaps(gmaps);
	locationsStore.setLocation(pos);
});

// Pusher Service
let pusherClient = pusher('86d676926d4afda44089', '/api/pusher/auth');

let usersStore = flux.store('users'),
	messageStore = flux.store('messages'),
	loggedUser = usersStore.getLoggedUser();

if (loggedUser) {
	envData.user = loggedUser;
}

pusherClient.subscribeUser(flux, loggedUser);

usersStore.on("login", function () {
	envData.user = usersStore.getLoggedUser();
	messageStore.setMe(usersStore.getLoggedUser());
	pusherClient.subscribeUser(flux, usersStore.getLoggedUser());
});

usersStore.on("logout", function () {
	envData.user = null;
	pusherClient.unsubscribeUser();
});

// Trigger Download Modal
let routesVisited = 0;

// Mesure Performance
let Perf = React.addons.Perf;

router.run(function (Handler, state) {
	Perf.start();
	React.render(
		React.createElement(Handler, {
			flux: flux,
			params: state.params
		}),
		document.getElementById('main-mount'),
		function () {
			Perf.stop();
			//Perf.printInclusive();
			//Perf.printExclusive();
			Perf.printWasted();
			console.log("Router run!");
			ga('send', 'pageview', state.path);
			routesVisited++;
			if (routesVisited === 3) {
				flux.actions.showDownloadPopup();
			}
		}
	);
});
