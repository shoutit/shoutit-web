var React = require('react'),
	Router = require('react-router');

module.exports = React.createClass({
	displayName: "Root",

	render: function () {
		return (
			<Router.RouteHandler flux={this.props.flux}/>
		);
	}
});
