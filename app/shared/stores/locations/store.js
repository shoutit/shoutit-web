/**
 * Created by Philip on 08.05.2015.
 */
import Fluxxor from 'fluxxor';
import where from 'lodash/collection/where';
import pluck from 'lodash/collection/pluck';
import flatten from 'lodash/array/flatten';
import uniq from 'lodash/array/uniq';

import consts from './consts';

let LocationsStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			runningAutocomplete: null,
			loadingLocation: null,
			current: {
				location: null,
				country: null,
				city: null,
				state: null
			},
			locations: {},
			search: {}
		};

		this.router = props.router;

		if (props.currentLocation) {
			this.state.current.location = props.currentLocation;
		}

		if (props.params) {
			if (props.params.city) {
				this.state.current.city = props.params.city;
				this.state.current.country = props.params.country;
				this.state.current.state = props.params.state;
			}
		}

		this.bindActions(
			consts.LOAD_PREDICTIONS, this.onLoadPredicitions,
			consts.SELECT_LOCATION, this.onSelectLocation
		);
	},

	onLoadPredicitions({term}) {
		if (this.state.runningAutocomplete) {
			clearTimeout(this.state.runningAutocomplete);
		}
		if (!this.state.locations[term]) {
			this.state.runningAutocomplete = setTimeout(function () {
				this.loadPlacePredictions(term, function (err, loadedTerm, results) {
					if (err) {
						console.warn(err);
					} else {
						this.state.locations[loadedTerm] = results;
						this.state.runningAutocomplete = null;
						this.emit("change");
					}
				}.bind(this));
			}.bind(this), 500);
			this.emit('change');
		}
	},

	onSelectLocation({prediction}) {
		this.geocoder.geocode({
			placeId: prediction.id
		}, this.parseGeocoderResult);
	},

	onLocUpdate() {
		this.flux.store('shouts').onLocUpdate();
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
		this.state.current.location = latLng;
		if (this.geocoder && !this.state.current.city) {
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

	parseGeocoderResult(results, status) {
		let newCity, newCountry, newState;
		if (status == this.gmaps.GeocoderStatus.OK) {
			if (results.length) {
				let localityResultsForCity = uniq(where(flatten(pluck(results, 'address_components')), {
						types: ['locality']
					}), 'short_name'),
					localityResultsForCountry = uniq(where(flatten(pluck(results, 'address_components')), {
						types: ['country']
					}), 'short_name'),
					localityResultsForState = uniq(where(flatten(pluck(results, 'address_components')), {
						types: ['administrative_area_level_1']
					}), 'short_name');
				if (localityResultsForCity.length) {
					let firstLocality = localityResultsForCity[0];
					newCity = firstLocality;
				}
				if (localityResultsForCountry.length) {
					let firstLocality = localityResultsForCountry[0];
					newCountry = firstLocality;
				}
				if (localityResultsForState.length) {
					let firstLocality = localityResultsForState[0];
					newState = firstLocality;
				}

				if (this.state.current.city != newCity.long_name ||
					this.state.current.country != newCountry.short_name ||
					this.state.current.state != newState.short_name) {

					this.state.current.city = newCity.long_name;
					this.state.current.country = newCountry.short_name;

					this.state.current.state = newState ? newState.short_name : null;

					if (this.state.current.city &&
						this.state.current.country
					) {
						// Populate Change to Shouts store
						this.onLocUpdate();
					}
				}
			} else {
				console.warn("No results found");
			}
		} else {
			console.warn('Geocoder failed due to: ' + status);
		}

		this.state.loadingLocation = false;
		this.emit("change");
	},

	resolvePosition(pos) {
		this.geocoder.geocode({
			latLng: pos
		}, this.parseGeocoderResult);
	},

	geocode(latLng, cb) {
		this.geocoder.geocode({latLng}, function (results, status) {
			if (status == this.gmaps.GeocoderStatus.OK) {
				cb(null, results);
			} else {
				cb(status);
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
		return this.state.current.city;
	},

	getCurrentCountry() {
		return this.state.current.country;
	},

	getCurrentState() {
		return this.state.current.state;
	},

	getGMapsInstance() {
		return this.gmaps;
	}
});

export default LocationsStore;
