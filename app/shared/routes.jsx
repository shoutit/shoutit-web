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
	Search = require('./components/search/search.jsx'),
	ProfileSettings = require('./components/profile/profileSettings.jsx'),
	ProfileListeners = require('./components/profile/profileListeners.jsx'),
	ProfileListening = require('./components/profile/profileListening.jsx'),
	ProfileOffers = require('./components/profile/profileOffers.jsx'),
	ProfileRequests = require('./components/profile/profileRequests.jsx'),
	TagProfile = require('./components/tag/tagProfile.jsx'),
	TagProfileOffers = require('./components/tag/tagProfileOffers.jsx'),
	TagProfileRequest = require('./components/tag/tagProfileRequests.jsx'),
	TagProfileListeners = require('./components/tag/tagProfileListeners.jsx');

module.exports = (
	<Route name="root" path="/" handler={Root}>
		<Route name="app" path="/" handler={App}>
			<Route name="offers" handler={Home}/>
			<Route name="requests" handler={Home}/>
			<Route name="map" handler={Simple}/>
			<Route name="user" path="/user/:username" handler={Profile}>
				<Route name="listeners" handler={ProfileListeners}/>
				<Route name="listening" handler={ProfileListening}/>
				<Route name="useroffers" handler={ProfileOffers}/>
				<Route name="userrequests" handler={ProfileRequests}/>
				<DefaultRoute name="settings" handler={ProfileSettings}/>
			</Route>
			<Route name="shout" path="/shout/:shoutId" handler={Shout}/>
			<Route name="tag" path="/tag/:tagName" handler={TagProfile}>
				<Route name="tagrequests" handler={TagProfileRequest}/>
				<Route name="taglisteners" handler={TagProfileListeners}/>
				<DefaultRoute name="tagoffers" handler={TagProfileOffers}/>
			</Route>
			<Route name="message" path="/message/:msgId" handler={Simple}/>
			<Route name="search" path="/search/:term" handler={Search}/>
			<DefaultRoute name="shouts" handler={Home}/>
		</Route>
		<Route name="login" handler={Login}/>
		<NotFoundRoute handler={NotFound}/>
	</Route>
);

