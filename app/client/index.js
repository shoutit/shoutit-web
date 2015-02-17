var React = require("react"),
	Router = require("react-router");

var routes = require("../shared/routes.jsx");
//Flux = require("../shared/flux");

/*var flux = Flux();

 if (window.fluxData) {
 flux.hydrate(window.fluxData);
 }*/

Router.create({
	routes: routes,
	location: Router.HistoryLocation
}).run(function (Handler, state) {
	React.render(
		React.createElement(Handler, {
			key: state.path
		}),
		document.getElementById('main-mount')
	);
});
