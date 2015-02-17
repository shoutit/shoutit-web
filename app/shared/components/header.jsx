/** @jsx React.DOM */

var React = require('react'),
	RowLogo = require('./header/rowLogo.jsx'),
	MainMenu = require('./header/mainMenu.jsx');

module.exports = Header = React.createClass({
	render: function () {
		return (
			<header>
				<RowLogo/>
				<MainMenu/>
			</header>
		);
	}
});