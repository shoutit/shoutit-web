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
    document.body.replaceChild(document.createElement('script'), document.getElementById('fluxData'));
    window.flux = flux;
}

flux.on("dispatch", function (type, payload) {
    if (console && console.log) {
        console.log("[Dispatch]", type, payload);
    }
});

// Facebook init
if (window.FB) {
    window.FB.init({
        appId: "353625811317277",
        version: 'v2.0'
    });
}


var ga = window.ga = window.ga || function () {
        (ga.q = ga.q || []).push(arguments);
    };
ga.l = new Date();
ga('create', 'UA-62656831-1', 'auto');

router.run(function (Handler, state) {
    React.render(
        React.createElement(Handler, {
            flux: flux
        }),
        document.getElementById('main-mount'),
        function () {
            flux.store("shouts").emit("change");
            ga('send', 'pageview', state.path);
        }
    );
});
