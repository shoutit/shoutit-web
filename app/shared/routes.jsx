/** @jsx React.DOM */

var React = require("react"),
	Router = require("react-router"),
	DefaultRoute = Router.DefaultRoute,
	NotFoundRoute = Router.NotFoundRoute,
	Route = Router.Route;

var App = require("./components/app.jsx"),
	NotFound = require("./components/notfound.jsx"),
	Home = require("./components/home.jsx");

module.exports = routes = (
	<Route handler={App} path="/">
		<DefaultRoute name="home" handler={Home}/>
		<Route name="offers" path="/offers" handler={NotFound}/>
		<NotFoundRoute handler={NotFound}/>
	</Route>
);

