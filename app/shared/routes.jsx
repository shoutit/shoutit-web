/** @jsx React.DOM */

var React = require("react"),
	Router = require("react-router"),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute;

var App = require("./components/app.jsx"),
	Home = require("./components/home.jsx"),
	Simple = require("./components/simple.jsx");

module.exports = (
	<Route name="app" path="/" handler={App} >
		<Route name="offers" handler={Simple}/>
		<DefaultRoute handler={Home}/>
	</Route>
);

