/** @jsx React.DOM */

var React = require('react'),
	RowLogo = require('./rowLogo.jsx'),
	MainMenu = require('./mainMenu.jsx');

module.exports = React.createClass({
	displayName: "Header",

	render: function () {
		return (
			<header>
				<RowLogo/>
				<MainMenu/>
			</header>
		);
	}
});