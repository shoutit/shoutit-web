import React from 'react';
//import FeaturedTagsContainer from '../featuredTags/featuredTagsContainer.jsx';
import {Grid, Column} from '../helper';
import LeftBoard from './leftboard.jsx';
import RightBoard from './rightboard.jsx';


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

	childContextTypes: {
		flux: React.PropTypes.object,
		params: React.PropTypes.object
	},

	getChildContext() {
		return {
			flux: this.props.flux,
			params: this.props.params
		}
	},

	render() {
		return (
			<div className="homepage-holder">
				<Grid >
				<Column size="3" clear={true}>
					<LeftBoard />
				</Column>
				<Column size="9">
					{React.cloneElement(this.props.children, {flux: this.props.flux})}
				</Column>
				<Column size="3">
					<RightBoard />
				</Column>
				</Grid>
			</div>
		);
	}

	//<FeaturedTagsContainer flux={this.props.flux} params={this.props.params} size="small"/>
});
