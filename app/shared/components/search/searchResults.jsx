var React = require('react'),
	Router = require('react-router'),
	RouteHandler = Router.RouteHandler,
	Col = require('react-bootstrap/Col');

var SearchTitle = require('./searchTitle.jsx');

module.exports = React.createClass({
	displayName: "SearchResults",

	render: function () {
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