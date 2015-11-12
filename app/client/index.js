import React from 'react'; // /addons
import { render } from 'react-dom';
import {Router} from 'react-router';
import routes from '../shared/routes.jsx';
import Flux from '../shared/flux';
import facebook from './fb';
import gAnalytics from './ga';
import pusher from './pusher';
import isMobile from 'ismobilejs';
import createBrowserHistory from 'history/lib/createBrowserHistory';

let injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let envData = {};

envData.mobile = isMobile.any;

let flux = new Flux(null);

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

// setting google maps
if(window.google) {
	let locationStore = flux.store('locations');
	locationStore.setGMaps(window.google.maps);
}

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
//let Perf = React.addons.Perf;

// Passing history and flux to components
const createFluxComponent = (Component, props) => {
  return <Component {...props} flux={flux} />;
};

let history = createBrowserHistory();
console.log(window.location.href);

render((
		<Router history={history} createElement={createFluxComponent}>
  			{routes(envData)}
  		</Router>
		), document.getElementById('main-mount'), function() { 
			ga('send', 'pageview', window.location.href ); 
		});
