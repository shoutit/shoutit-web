import React from 'react';
import { Col } from 'react-bootstrap';
import {Link} from 'react-router';
import Shout from './feed/shout.jsx';
import Loader from '../helper/loader.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';

const typeToRoute = {
	"all": "all",
	"offer": "offers",
	"request": "requests"
};

export default React.createClass({
	displayName: "Feed",

	renderShouts() {
		let storeState = this.props.shouts,
			collection = storeState[this.props.type],
			shouts = collection.shouts,
			next = collection.next,
			prev = collection.prev,
			onLastVisibleChange = this.onLastVisibleChange,
			isLoading = storeState.loading;

		let locStoreState = this.props.locations,
			currentCity = locStoreState.current.city,
			currentCountry = locStoreState.current.country,
			currentState = locStoreState.current.state,
			params = function (page) {
				return {
					city: currentCity ? encodeURIComponent(currentCity) : "all",
					country: currentCountry ? encodeURI(currentCountry) : "all",
					state: currentState ? encodeURI(currentState) : "all",
					page: page
				};
			};

		let shoutEls = [];

		if (prev) {
			shoutEls.push(
				<section key={"shout-0"}>
					<Col xs={12} md={12}>
						<noscript>
							<Link to={typeToRoute[this.props.type]}
								  params={params(prev)}>
								Previous Page
							</Link>
						</noscript>
					</Col>
				</section>
			);
		}

		shoutEls.push(shouts.length > 0 ?
				shouts.map((shout, i) => (<Shout key={"shout-" + (i + 1) } shout={shout} index={i}/>)) :
				(<h5 key="warning">There are currently no shouts in your country. You may want to select another
					location above.</h5>)
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
									  params={params(next)}>
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
			<div>
				{this.renderShouts()}
			</div>
		);
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.props.loadMore();
		}
	}
});
