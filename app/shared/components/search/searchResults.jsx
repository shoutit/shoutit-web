var React = require('react'),
	Col = require('react-bootstrap/Col');

var SearchTitle = require('./searchTitle.jsx'),
	SearchResultList = require('./searchResultList.jsx');

module.exports = React.createClass({
	displayName: "SearchResults",

	render: function () {
		return (
			<Col xs={12} md={9} className="pro-right-padding">
				<Col xs={12} md={12} className="content-listener">
					<div className="listener">
						<SearchTitle {...this.props}/>
						<SearchResultList {...this.props}/>
					</div>
				</Col>
			</Col>
		);
	}
});