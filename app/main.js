/**
 * Created by Philip on 12.01.2015.
 */

var React = require('react'),
	Home = require('./shared/components/home.jsx');

	//GPlus = require('./vendor/gplus');

var ReactRouter = require('react-router'),
	Route = ReactRouter.Route,
	DefaultRoute = ReactRouter.DefaultRoute;

var mount = document.getElementById('main-mount');

var App = React.createClass({

});

var routes = (
	<Route handler={App} path="/">
		<DefaultRoute handler={Home}/>
		<Route name="login" handler={Login} />
	</Route>
);


// Init G+ Button
//GPlus.init(window);


// Start Router
ReactRouter.run(routes,function(Handler) {
	React.render(<Handler />, mount, function() {
		console.log("Mounted!");
	});
});


