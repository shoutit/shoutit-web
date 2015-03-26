var React = require("react"),
	Router = require("react-router"),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	NotFoundRoute = Router.NotFoundRoute,
	Redirect = Router.Redirect;

var Root = require("./components/root.jsx"),
	Login = require("./components/login/login.jsx"),
	App = require("./components/app.jsx"),
	Home = require("./components/home/home.jsx"),
	Simple = require("./components/misc/simple.jsx"),
	NotFound = require("./components/misc/notfound.jsx"),
	Shout = require('./components/shout/shoutDetail.jsx'),
	Profile = require('./components/profile/profile.jsx'),
	ProfileSettings = require('./components/profile/profileSettings.jsx'),
	ProfileListeners = require('./components/profile/profileListeners.jsx'),
	ProfileListening = require('./components/profile/profileListening.jsx'),
	ProfileOffers = require('./components/profile/profileOffers.jsx'),
	ProfileRequests = require('./components/profile/profileRequests.jsx');

module.exports = (
	<Route name="root" path="/" handler={Root}>
		<Route name="app" path="/" handler={App} >
			<Route name="offers" handler={Home} />
			<Route name="requests" handler={Home} />
			<Route name="map" handler={Simple}/>
			<Route name="profile" path="/profile" handler={Profile}>
				<Route name="profilelisteners" path="/profile/listeners" handler={ProfileListeners}/>
				<Route name="profilelistening" path="/profile/listening" handler={ProfileListening}/>
				<Route name="profileoffers" path="/profile/offers" handler={ProfileOffers}/>
				<Route name="profilerequests" path="/profile/requests" handler={ProfileRequests}/>
				<DefaultRoute name="profilesettings" handler={ProfileSettings}/>
			</Route>
			<Route name="user" path="/user/:username" handler={Simple}>
				<Route name="listening" handler={Simple}/>
				<Route name="useroffers" handler={Simple}/>
				<Route name="userrequests" handler={Simple}/>
			</Route>
			<Route name="shout" path="/shout/:shoutId" handler={Shout}/>
			<Route name="tag" path="/tag/:tagName" handler={Simple}/>
			<Route name="message" path="/message/:msgId" handler={Simple}/>
			<DefaultRoute name="shouts" handler={Home} />
		</Route>
		<Route name="login" handler={Login}/>
		<NotFoundRoute handler={NotFound} />
	</Route>
);

