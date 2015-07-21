import React from 'react';

import ProfileShoutList from './tagProfileShoutList.jsx';

export default React.createClass({
	displayName: "TagProfileOffers",

	statics: {
		fetchData(client, session, params) {
			return client.tags().getShouts(session, params.tagName, 'offer');
		}
	},

	render() {
		return (
			<ProfileShoutList type="offer" {...this.props}/>
		);
	}
});
