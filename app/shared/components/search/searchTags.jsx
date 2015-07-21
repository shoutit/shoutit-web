import React from 'react';

import SearchTagList from './searchTagList.jsx';

export default React.createClass({
	displayName: "SearchTags",

	statics: {
		fetchData(client, session, params) {
			return client.tags().search(session, {
				search: params.term
			});
		}
	},

	render() {
		return (
			<SearchTagList {...this.props}/>
		);
	}
});
