/**
 * Created by Philip on 08.05.2015.
 */
import Fluxxor from 'fluxxor';
import where from 'lodash/collection/where';

import consts from './consts';

var LocationsStore = Fluxxor.createStore({
    initialize(props) {
        this.state = {
            runningAutocomplete: null,
            loadingLocation: null,
            currentLocation: null,
            currentCity: null,
            locations: {},
            search: {}
        };

        if (props.currentLocation) {
            this.state.currentLocation = props.currentLocation;
        }

        this.bindActions(
            consts.LOAD_PREDICTIONS, this.onLoadPredicitions,
            consts.SELECT_LOCATION, this.onSelectLocation
        );
    },

    onLoadPredicitions(payload) {
        let newTerm = payload.term;
        if (this.state.runningAutocomplete) {
            clearTimeout(this.state.runningAutocomplete);
        }
        if (!this.state.locations[newTerm]) {
            this.state.runningAutocomplete = setTimeout(function () {
                this.loadPlacePredictions(newTerm, function (err, term, results) {
                    if (err) {
                        console.warn(err);
                    } else {
                        this.state.locations[term] = results;
                        this.state.runningAutocomplete = null;
                        this.emit("change");
                    }
                }.bind(this));
            }.bind(this), 500);
            this.emit('change');
        }
    },

    onSelectLocation(payload) {
        let prediction = payload.prediction;
        this.state.currentCity = prediction.city;
        this.state.currentLocation = null;
        this.emit('change');

        // Populate Change to Shouts store
        this.flux.store('shouts').onUpdate();
    },

    loadPlacePredictions(term, cb){
        if (this.autocomplete && term.length >= 3) {
            let places = this.gmaps.places;
            this.autocomplete.getPlacePredictions({
                    input: term,
                    types: ["(cities)"]
                },
                function (predictions, status) {
                    if (status === places.PlacesServiceStatus.OK) {
                        let results = predictions.map(prediction => ({
                            id: prediction.place_id,
                            description: prediction.description,
                            city: prediction.terms[0].value,
                            country: prediction.terms[prediction.terms.length - 1].value
                        }));
                        cb(null, term, results);
                    } else {
                        cb(predictions);
                    }
                }
            );
        }
    },

    setLocation(latLng) {
        this.state.currentLocation = latLng;
        if (this.geocoder) {
            this.resolvePosition(latLng);
        }
        this.emit("change");
    },


    setGeocoder(geocoder, gmaps) {
        this.geocoder = geocoder;
        this.gmaps = gmaps;
        this.state.loadingLocation = true;
        this.emit("change");
    },

    setAutoComplete(autoComplete) {
        this.autocomplete = autoComplete;
    },

    resolvePosition(pos) {
        this.geocoder.geocode({
            latLng: pos
        }, function (results, status) {
            if (status == this.gmaps.GeocoderStatus.OK) {
                if (results.length) {
                    let localityResults = where(results, {types: ['locality']});
                    if (localityResults.length) {
                        let firstLocality = localityResults[0];
                        let city = firstLocality.address_components[firstLocality.types.indexOf('locality')];
                        this.state.currentCity = city.long_name;
                    }
                } else {
                    console.warn("No results found");
                }
            } else {
                console.warn('Geocoder failed due to: ' + status);
            }
            this.state.loadingLocation = false;
            this.emit("change");
            if(this.state.currentCity) {
                // Populate Change to Shouts store
                this.flux.store('shouts').onUpdate();
            }

        }.bind(this));
    },

    serialize() {
        return JSON.stringify(this.state);
    },

    hydrate(json) {
        this.state = JSON.parse(json);
    },

    getState() {
        return this.state;
    },

    getCurrentCity() {
        return this.state.currentCity;
    }
});

export default LocationsStore;
