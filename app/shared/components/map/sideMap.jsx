import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

export default React.createClass({
	displayName: "SideMap",
	mixins: [new FluxMixin(React), new StoreWatchMixin('shouts', 'locations')],

	contextTypes: {
		router: React.PropTypes.func
	},

	getStateFromFlux() {
		return {
			shouts: this.getFlux().store('shouts').getState(),
			locations: this.getFlux().store('locations').getState()
		};
	},

	getInitialState() {
		return {
			map: null,
			markers: {}
		};
	},

	render() {
		return this.isMapsAvailable() ? (
			<div ref="mapContainer" className="map">
			</div>
		) : null;
	},

	shouldComponentUpdate () {
		return true;
	},

	isMapsAvailable() {
		return typeof window !== 'undefined' && window.google && window.google.maps;
	},

	componentWillUpdate () {
		if (this.isMapsAvailable()) {
			let gMaps = window.google.maps;

			if (this.state.locations.current.location && !this.state.map) {
				let mapOpts = {
					center: this.state.locations.current.location,
					zoom: 10,
					mapTypeControl: false,
					overviewMapControl: false,
					panControl: false,
					rotateControl: false,
					scaleControl: false,
					streetViewControl: false,
					zoomControl: false
				};

				this.state.map = new gMaps.Map(React.findDOMNode(this.refs.mapContainer), mapOpts);
			}

			if (this.state.map) {
				let shouts = this.state.shouts.all.shouts,
					markers = this.state.markers,
					map = this.state.map;

				shouts.forEach((shout) => {
					if (!markers[shout.id]) {
						let marker = markers[shout.id] = new gMaps.Marker({
							map: map,
							title: shout.title,
							position: new gMaps.LatLng(shout.location.latitude, shout.location.longitude)
						});

						gMaps.event.addListener(marker, 'click', function () {
							this.context.router.transitionTo('shout',
								{shoutId: shout.id});
						}.bind(this));
					} else {
						markers[shout.id].setMap(map);
					}
				});

				this.state.map.setCenter(this.state.locations.current.location);
			}
		}
	}
});
