import React from 'react';
import {Col, Grid} from 'react-bootstrap';
import FeaturedTagsContainer from '../featuredTags/featuredTagsContainer.jsx';


export default React.createClass({
	displayName: "Feed",

	statics: {
		// fetchId: 'tags',
		// fetchData(client, session, params) {
		// 	return client.tags().list(session, {
		// 		type: "featured",
		// 		page_size: 52,
		// 		city: params.city === "all" ? null : params.city,
		// 		country: params.country === "all" ? null : params.country,
		// 		state: params.state === "all" ? null : params.state
		// 	});
		// }
	},

	render() {
		return (
			<Grid>
				<Col xs={12} md={8} className="shoutFeed">
					{React.cloneElement(this.props.children, {flux: this.props.flux})}
				</Col>
				<Col xs={12} md={4} className="sidebar">
					<FeaturedTagsContainer flux={this.props.flux} params={this.props.params} size="small"/>
				</Col>
			</Grid>
		);
	}
});
