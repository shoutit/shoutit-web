import React from 'react';
import {RouteHandler} from 'react-router';
import {Col} from 'react-bootstrap';

import SearchTitle from './searchTitle.jsx';

export default React.createClass({
	displayName: "SearchResults",

	render() {
		return (
			<Col xs={12} md={9} className="pro-right-padding">
				<Col xs={12} md={12} className="content-listener">
					<div className="listener">
						<SearchTitle {...this.props}/>
						<RouteHandler {...this.props}/>
					</div>
				</Col>
			</Col>
		);
	}
});
