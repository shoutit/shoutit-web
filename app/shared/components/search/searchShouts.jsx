import React from 'react';

import SearchShoutList from './searchShoutList.jsx';

export default React.createClass({
	displayName: "SearchShouts",

	statics: {
		fetchData(client, session, params, name, queries) {
			return client.shouts().list(session, {
				search: params.term,
				category: params.category,
				shout_type: params.shouttype
			});
		}
	},

	contextTypes: {
    	router: React.PropTypes.func
  	},

	render() {
		return (
			<SearchShoutList {...this.props}/>
		);
	}
});
