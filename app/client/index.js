var React = require("react"),
	Router = require("react-router");

var routes = require("../shared/routes.jsx"),
	Flux = require("../shared/flux");

var router = Router.create({
	routes: routes,
	location: Router.HistoryLocation
});

var flux = Flux(router);

if (window.fluxData) {
	flux.hydrate(window.fluxData);
}

router.run(function (Handler, state) {
	React.render(
		React.createElement(Handler, {
			key: state.path,
			flux: flux
		}),
		document.getElementById('main-mount')
	);
});
