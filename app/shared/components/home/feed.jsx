import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import { Col } from 'react-bootstrap';

import {Link} from 'react-router';

import Shout from './feed/shout.jsx';
import Loader from '../helper/loader.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import DocumentTitle from 'react-document-title';

const titles = {
	"all": "Home",
	"offer": "Offers",
	"request": "Requests"
};

const typeToRoute = {
	"all": "feed",
	"offer": "offers",
	"request": "requests"
};

export default React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},

	mixins: [new FluxMixin(React), new StoreWatchMixin("shouts", "locations")],

	displayName: "Feed",

	getStateFromFlux() {
		let flux = this.getFlux();
		return {
			shouts: flux.store("shouts").getState(),
			locations: flux.store("locations").getState()
		};
	},

	renderShouts() {
		let storeState = this.state.shouts,
			collection = storeState[this.props.type],
			shouts = collection.shouts,
			onLastVisibleChange = this.onLastVisibleChange,
			isLoading = storeState.loading;
		let shoutEls = shouts.map((shout, i) => (<Shout key={"shout-" + i} shout={shout} index={i}/>));

		if (isLoading && typeof window !== 'undefined') {
			shoutEls.push(
				<section key={"shout-" + shouts.length}>
					<Col xs={12} md={12}>
						<Loader/>
					</Col>
				</section>);
		} else if (collection.next) {
			shoutEls.push(
				<section key={"shout-" + shouts.length}>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={onLastVisibleChange}>
							LoadMore
						</ViewportSensor>
					</Col>
				</section>
			);
		}

		return shoutEls;
	},

	render() {
		return (
			<DocumentTitle title={titles[this.props.type] + " - Shoutit"}>
				<Col xs={12} md={8}>
					{this.renderShouts()}
				</Col>
			</DocumentTitle>
		);
	},

	loadMore() {
		this.getFlux().actions.loadMore(this.props.type);
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.loadMore();
		}
	},

	componentDidMount() {
		let storeState = this.state.shouts,
			collection = storeState[this.props.type],
			shouts = collection.shouts;

		if (shouts.length === 0) {
			this.loadMore();
		}
	},

	componentDidUpdate() {
		let locStoreState = this.state.locations,
			currentCity = locStoreState.currentCity;
		if (currentCity) {
			this.context.router.transitionTo(typeToRoute[this.props.type], {city: currentCity});
		}
	}
});
