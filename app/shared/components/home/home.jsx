import React from 'react';

import Feed from './feed.jsx';

import defaults from '../../consts/defaults';

export default function (type="all") {
	return React.createClass({
		displayName: type,

		statics: {
			fetchData(client, session, params) {
				return client.shouts().list(session, {
					shout_type: type,
					page_size: defaults.PAGE_SIZE,
					city: params.city,
					page: params.page
				});
			}
		},

		render() {
			return (<Feed flux={this.props.flux} type={type}/>);
		}
	});
}
