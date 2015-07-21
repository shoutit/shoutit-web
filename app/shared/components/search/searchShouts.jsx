import React from 'react';

import SearchShoutList from './searchShoutList.jsx';

export default React.createClass({
	displayName: "SearchShouts",

	statics: {
		fetchData(client, session, params) {
			return client.shouts().list(session, {
				search: params.term
			});
		}
	},

	render() {
		return (
			<SearchShoutList {...this.props}/>
		);
	}
});
