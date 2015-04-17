var React = require('react'),
	Button = require('react-bootstrap/Button'),
	Input = require('react-bootstrap/Input'),
	Icon = require('../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "SearchTitle",

	renderInput: function () {
		return (
			<Input
				type="text"
				addonAfter={
				<Button className="chat-search-button" bsStyle="link">
					<Icon name="search-chat"/>
				</Button>
				}
				onChange={this.props.onTermChange}
				value={this.props.term}
				/>
		)
	},

	render: function () {
		return (
			<div className="listener-title search-shoutit">
				<p>Results</p>

				<div className="search-listener">
					<div className="chat-search">
						{this.renderInput()}
					</div>
				</div>
			</div>
		);
	}
});