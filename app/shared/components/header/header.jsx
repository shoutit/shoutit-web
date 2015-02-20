/** @jsx React.DOM */

var React = require('react'),
	TopBar = require('./topBar.jsx'),
	MainMenu = require('./mainMenu.jsx');

module.exports = React.createClass({
	displayName: "Header",

	render: function () {
		return (
			<header>
				<TopBar/>
				<MainMenu/>
			</header>
		);
	}
});