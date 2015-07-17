import React from 'react';
import {Grid} from 'react-bootstrap';
import FeaturedTags from './featuredTags.jsx';

export default React.createClass({
	display: "Discover",

	render() {
		return (
			<Grid>
				<FeaturedTags {...this.props}/>
			</Grid>
		);
	}
});
