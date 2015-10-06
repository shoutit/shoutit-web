import React from 'react';
import {RouteHandler} from 'react-router';
import {Col} from 'react-bootstrap';

import SearchShouts from './searchShouts.jsx';

export default React.createClass({
	displayName: "SearchResults",

	render() {
		return (
			<Col xs={12} md={9} className="pro-right-padding">
				<Col xs={12} md={12} className="content-listener">
					<div className="listener">
						<SearchShouts {...this.props}/>
					</div>
				</Col>
			</Col>
		);
	}
});
