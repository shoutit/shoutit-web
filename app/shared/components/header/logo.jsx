

var React = require('react'),
	Col = require('react-bootstrap/Col'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	displayName: "Logo",

	render: function () {
		return (
			<Link to="app">
				<img src="/img/logo.png"/>
			</Link>
		);
	}
});