import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import Shout from '../feed/feed/shout.jsx';

export default React.createClass({
	displayName: "SearchShoutList",

	componentDidMount() {
		let term = this.props.term,
			category = this.props.category,
			shouttype = this.props.shouttype,
			tags = this.props.tags,
			min = this.props.min,
			max = this.props.max,
			shouts = this.props.search.shouts[term],
			city = this.props.city || undefined,
			country = this.props.country || undefined;

		if (!shouts) {
			let payload = {
				term, category, shouttype, tags, min, max, city, country
			}
			this.props.flux.actions.searchShouts(payload);
		}
	},

	renderShouts(shouts) {
		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render() {
		let term = this.props.term,
			shouts = this.props.search.shouts,
			content;

		if (shouts) {
			content = this.renderShouts(shouts);
		} else {
			content = <Loader/>;
		}

		return (
			<div className="listener-scroll ctn-offerpro" tabIndex="5000"
				 style={{outline: "none"}}>
				{content}
				{this.renderViewportSensor()}
			</div>
		);
	},

	renderViewportSensor() {
		let loading = this.props.search.searching.shouts;

		if(loading) {
			return (
				<section>
					<Col xs={12} md={12}>
						<Loader />
					</Col>
				</section>);
		} else {
			return (
				<section>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
					</Col>
				</section>);
		}
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.props.flux.actions.searchLoadMore();
		}
	}
});
