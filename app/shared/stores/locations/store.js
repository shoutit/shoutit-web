/**
 * Created by Philip on 08.05.2015.
 */
import Fluxxor from 'fluxxor';
import where from 'lodash/collection/where';
import pluck from 'lodash/collection/pluck';
import flatten from 'lodash/array/flatten';
import uniq from 'lodash/array/uniq';

import consts from './consts';
import client from './client';

let LocationsStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			runningAutocomplete: null,
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
			consts.SELECT_LOCATION, this.onSelectLocation,
			consts.UPDATE_LOCATION_TO_FEED, this.onLocationUpdateToFeed,
			consts.ACQUIRE_LOCATION, this.onAcquireLoc
		);
	},

	isLocAvailable() {
		let loc = this.state.current;
		return loc.country && loc.city && loc.state? true: false;
	},

	updateLocation(loc, patchUserStore = false) {
		let {country, state, city} = loc;

		this.state.current.country = country;
		this.state.current.city = city;
		this.state.current.state = state;

		// updating location for shouts
		this.flux.store('shouts').onLocUpdate();

		patchUserStore? this.flux.store('users').saveLocation(loc): undefined;
	},

	onAcquireLoc() {
		let {isLocAvailable} = this;
		let lat = 0, lng = 0;

		// wait for user location to provide location if already saved
		this.waitFor(['users'], () => {
			if (isLocAvailable() === false) {
				// acquring user location from shoutit geocoding API
				client.geocode(lat, lng)
					.end((err, res) => {
						if(err) {
							console.log(err);
						} else {
							let loc = res.body;
							this.updateLocation(loc, true);
							this.emit("change");
						}
					});
			}
		});
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
		client.placeGeocode(prediction.id)
			.end(function (err, res) {
				if (err) {
					console.error(err);
				} else {
					this.parseGeocoderResult(res.body.results);
				}
			}.bind(this));
	},

	onLocationUpdateToFeed() {
		client.cityGeocode(
			this.state.current.country, this.state.current.state, this.state.current.city
		).end(function (err, res) {
				if (err) {
					console.error(err);
				} else {
					this.parseGeocoderResult(res.body.results);
				}
			}.bind(this));
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
		if (!this.state.current.location) {
			this.state.current.location = latLng;
			if (!this.state.current.city) {
				this.resolvePosition(latLng);
			}
			this.emit("change");
		}
	},

	setGMaps(gmaps) {
		this.gmaps = gmaps;
		this.autocomplete = new gmaps.places.AutocompleteService();
	},

	parseGeocoderResult(results) {
		let newCity, newCountry, newState, newLocation;
		let location = results[0].geometry.location;

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
				newCity = localityResultsForCity[0];
			}
			if (localityResultsForCountry.length) {
				newCountry = localityResultsForCountry[0];
			}
			if (localityResultsForState.length) {
				newState = localityResultsForState[0];
			}

			if (results[0].geometry) {
				newLocation = new window.google.maps.LatLng(location.lat, location.lng);
			}

			if (this.state.current.city != newCity.long_name ||
				this.state.current.country != newCountry.short_name ||
				this.state.current.state != newState.short_name) {

				let locObj = {};
				locObj.city = newCity.long_name;
				locObj.country = newCountry.short_name;
				locObj.state = newState ? newState.short_name : null;
				locObj.latitude = location.lat;
				locObj.longitude = location.lng;

				this.updateLocation(locObj, true);
			}

			if (newLocation) {
				this.state.current.location = newLocation;
			}
		} else {
			console.warn("No results found");
		}

		this.emit("change");
	},

	resolvePosition(pos) {
		client.geocode(pos.lat(), pos.lng())
			.end(function (err, res) {
				if (err) {
					console.error(err);
				} else {
					this.parseGeocoderResult(res.body.results);
				}
			}.bind(this));
	},

	geocode(latLng, cb) {
		client.geocode(latLng.lat(), latLng.lng())
			.end(function (err, res) {
				if (err) {
					cb(err);
				} else {
					cb(null, res.body);
				}
			});
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
