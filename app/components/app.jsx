/** @jsx React.DOM */

var React = require('react'),
	Login = require('./login.jsx'),
	Header = require('./header.jsx'),
	Content = require('./content.jsx');

module.exports = App = React.createClass({
	getDefaultProps: function () {
		return {
			screen: 'main'
		}
	},

	getInitialState: function () {
		return {
			screen: this.props.screen
		}
	},

	render: function () {
		var content;

		console.log("Screen: " + this.state.screen);

		if (this.state.screen === 'login') {
			content = <Login/>;
		} else if (this.state.screen === 'main') {
			content =
				<div>
					<Header/>
					<Content/>
				</div>
			;
		} else {
			content = <h1>404 Not Found</h1>;
		}

		return (
			<div>
				{content}
				<script src='/main.js'/>
			</div>
		);

	}
});