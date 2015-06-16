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
			next = collection.next,
			prev = collection.prev,
			onLastVisibleChange = this.onLastVisibleChange,
			isLoading = storeState.loading;

		let locStoreState = this.state.locations,
			currentCity = locStoreState.current.city;

		let shoutEls = [];

		if (prev) {
			shoutEls.push(
				<section key={"shout-0"}>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={onLastVisibleChange}>
							<noscript>
								<Link to={typeToRoute[this.props.type]}
									  params={{city: encodeURIComponent(currentCity || "anyplace"), page: prev}}>
									Previous Page
								</Link>
							</noscript>
						</ViewportSensor>
					</Col>
				</section>
			);
		}

		shoutEls.push(shouts.length > 0 ?
				shouts.map((shout, i) => (<Shout key={"shout-" + (i + 1) } shout={shout} index={i}/>)) :
				(<h5 key="warning">There are currently no shouts in your country. You may want to select another location above.</h5>)
		);

		if (isLoading && typeof window !== 'undefined') {
			shoutEls.push(
				<section key={"shout-" + (shouts.length + 1)}>
					<Col xs={12} md={12}>
						<Loader/>
					</Col>
				</section>);
		} else if (next) {
			shoutEls.push(
				<section key={"shout-" + (shouts.length + 1)}>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={onLastVisibleChange}>
							<noscript>
								<Link to={typeToRoute[this.props.type]}
									  params={{city: encodeURIComponent(currentCity || "anyplace"), page: next}}>
									Next Page
								</Link>
							</noscript>
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
			currentCity = locStoreState.current.city,
			currentCountry = locStoreState.current.country,
			currentState = locStoreState.current.state,
			currentPage = this.context.router.getCurrentParams().page;
		if (currentCity) {
			this.context.router.transitionTo(typeToRoute[this.props.type],
				{country: currentCountry, state: currentState, city: currentCity, page: currentPage});
		}
	}
});
