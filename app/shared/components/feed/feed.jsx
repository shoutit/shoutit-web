import React from 'react';
import {Col, Grid} from 'react-bootstrap';

import {RouteHandler} from 'react-router';

import FeaturedTagsContainer from '../featuredTags/featuredTagsContainer.jsx';
import SideMap from '../map/sideMap.jsx';

export default React.createClass({
	displayName: "Feed",

	render() {
		return (
			<Grid>
				<Col xs={12} md={8} className="shoutFeed">
					<RouteHandler flux={this.props.flux} />
				</Col>
				<Col xs={12} md={4} className="sidebar">
					<SideMap flux={this.props.flux}/>
					<FeaturedTagsContainer flux={this.props.flux} size="small"/>
				</Col>
			</Grid>
		);
	}
});
