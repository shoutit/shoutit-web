import React from 'react';
import {Loader, Clear, Column, Grid} from '../helper';
import Shout from '../feed/feed/shout.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';

let map = {
	request: "Requests",
	offer: "Offers"
};

export default React.createClass({
	displayName: "ProfileShoutList",

	contextTypes: {
		flux: React.PropTypes.object
	},

	componentDidMount() {
		let username = this.props.username,
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'];

		if (!userShouts || !shouts) {
			this.context.flux.actions.loadUserShouts(this.props.username, this.props.type);
		}
	},

	renderProfileShouts(shouts) {
		let onLastVisibleChange = this.onLastVisibleChange;

		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts posted by this user yet :(</h4>;
	},

	renderViewportSensor() {
		let username = this.props.username,
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'];

		if(userShouts && shouts) {
			if(this.props.loading) {
				return (
					<Loader />
					);
			} else {
				return (
					<ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
					);
			}
		}
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.loadMore();
		}
	},

	loadMore() {
		this.context.flux.actions.loadMoreUserShouts(this.props.username, this.props.type);
	},

	render() {
		let username = this.props.username,
			user = this.props.users[username],
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'],
			markup = null;

		if (shouts) {
			markup = this.renderProfileShouts(shouts);
		} else {
			markup = <Loader/>;
		}

		return (
			<Grid fluid={true} style={{marginTop: "20px"}}>
				{markup}
				{this.renderViewportSensor()}
			</Grid>
		);
	}
});
