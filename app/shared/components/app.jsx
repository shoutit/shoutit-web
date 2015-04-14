var React = require('react'),
	Router = require('react-router'),
	Container = require('react-bootstrap/Grid'),
	Header = require('./header/header.jsx');

var App = React.createClass({
	render: function () {
		return (
			<div>
				<Header flux={this.props.flux}/>
				<div className="content">
					<Container className="padding0">
						<Router.RouteHandler flux={this.props.flux}/>
					</Container>
				</div>
			</div>
		);
	}
});

module.exports = App;