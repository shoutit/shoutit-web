var React = require("react"),
	Router = require("react-router"),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	Redirect = Router.Redirect;

var Root = require("./components/root.jsx"),
	Login = require("./components/login/login.jsx"),
	App = require("./components/app.jsx"),
	Home = require("./components/home/home.jsx"),
	Simple = require("./components/misc/simple.jsx");


module.exports = (
	<Route name="root" path="/" handler={Root}>
		<Route name="app" path="/" handler={App} >
			<Route name="offers" handler={Home}/>
			<Route name="requests" handler={Home}/>
			<Route name="map" handler={Simple}/>
			<Route name="user" path="/user/:username" handler={Simple}>
				<Route name="listening" path="/user/:username/listening" handler={Simple}/>
				<Route name="useroffers" path="/user/:username/offers" handler={Simple}/>
				<Route name="userrequests" path="/user/:username/requests" handler={Simple}/>
			</Route>
			<Route name="shout" path="/shout/:shoutId" handler={Simple}/>
			<Route name="tag" path="/tag/:tagName" handler={Simple}/>
			<Route name="message" path="/message/:msgId" handler={Simple}/>
			<DefaultRoute handler={Home}/>
		</Route>
		<Route name="login" handler={Login}/>
	</Route>
);

