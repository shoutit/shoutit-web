import React from 'react';
import {Col, Grid} from 'react-bootstrap';

import {RouteHandler} from 'react-router';

import FeaturedTagsContainer from '../featuredTags/featuredTagsContainer.jsx';
import SideMap from '../map/sideMap.jsx';

export default React.createClass({
	displayName: "Feed",

	statics: {
		fetchData(client, session, params) {
			return client.tags().list(session, {
				type: "featured",
				page_size: 52,
				city: params.city === "all" ? null : params.city,
				country: params.country === "all" ? null : params.country,
				state: params.state === "all" ? null : params.state
			});
		}
	},

	render() {
		return (
			<Grid>
				<Col xs={12} md={8} className="shoutFeed">
					<RouteHandler flux={this.props.flux} />
				</Col>
				<Col xs={12} md={4} className="sidebar">
					{/* <SideMap flux={this.props.flux}/> */}
					<FeaturedTagsContainer flux={this.props.flux} size="small"/>
				</Col>
			</Grid>
		);
	}
});
