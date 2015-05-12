import React from 'react';
import Router from 'react-router';

import routes from '../shared/routes.jsx';
import Flux from '../shared/flux';

import facebook from './fb';
import gAnalytics from './ga';
import geolocation from './geolocation';

let router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
});

let flux = new Flux(router);

if (window.fluxData) {
    flux.hydrate(window.fluxData);
    document.body.replaceChild(document.createElement('script'), document.getElementById('fluxData'));
    //window.flux = flux;
}

flux.on("dispatch", function (type, payload) {
    if (console && console.log) {
        console.log("[Dispatch]", type, payload);
    }
});

// Facebook init
facebook("353625811317277");

// Google Analytics init
let ga = gAnalytics('UA-62656831-1');

// Maps Geolocation
geolocation(function (gmaps, pos) {
    let geoCoder = new gmaps.Geocoder(),
        autoComplete = new gmaps.places.AutocompleteService();
        //places = new gmaps.places.PlacesService();

    let locationsStore = flux.store('locations');

    locationsStore.setGeocoder(geoCoder, gmaps);
    locationsStore.setLocation(pos);
    locationsStore.setAutoComplete(autoComplete);
    //locationsStore.setPlaces(places);
});


router.run(function (Handler, state) {
    React.render(
        React.createElement(Handler, {
            flux: flux
        }),
        document.getElementById('main-mount'),
        function () {
            ga('send', 'pageview', state.path);
        }
    );
});
