/** @jsx React.DOM */

var React = require("react"),
	Router = require("react-router"),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute;

var Root = require("./components/root.jsx"),
	Login = require("./components/login.jsx"),
	App = require("./components/app.jsx"),
	Home = require("./components/home/home.jsx"),
	Simple = require("./components/misc/simple.jsx");

module.exports = (
	<Route name="root" path="/" handler={Root}>
		<Route name="app" path="/" handler={App} >
			<Route name="offers" handler={Home}/>
			<Route name="requests" handler={Simple}/>
			<Route name="map" handler={Simple}/>
			<DefaultRoute handler={Home}/>
		</Route>
		<Route name="login" handler={Login}/>
	</Route>
);

