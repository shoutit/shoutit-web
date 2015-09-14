import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';

import Shout from '../feed/feed/shout.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';

let map = {
	request: "Requests",
	offer: "Offers"
};

export default React.createClass({
	displayName: "ProfileShoutList",

	componentDidMount() {
		let username = this.props.username,
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'];

		if (!userShouts || !shouts) {
			this.props.flux.actions.loadUserShouts(this.props.username, this.props.type);
		}
	},

	renderProfileShouts(shouts) {
		let onLastVisibleChange = this.onLastVisibleChange;

		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render() {
		let username = this.props.username,
			user = this.props.users[username],
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'],
			content, stat;

		if (userShouts && shouts) {
			content = this.renderProfileShouts(shouts);
			stat = <span>{' (' + shouts.length + ')'}</span>;
		} else {
			content = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>
							{user.first_name + "'s " + map[this.props.type] + ":"}
							{stat}
						</p>
					</div>
					<Clear />

					<div className="listener-scroll ctn-offerpro" tabIndex="5000"
						 style={{outline: "none"}}>
						{content}
						{this.renderViewportSensor()}
					</div>
				</div>
			</Col>
		);
	},

	renderViewportSensor() {
		if(this.props.loading) {
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
			this.loadMore();
		}
	},

	loadMore() {
		this.props.flux.actions.loadMoreUserShouts(this.props.username, this.props.type);
	}
});
