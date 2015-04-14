var React = require('react'),
	map = require('lodash/collection/map'),
	Button = require('react-bootstrap/Button'),
	Input = require('react-bootstrap/Input'),
	DropdownButton = require('react-bootstrap/DropdownButton'),
	MenuItem = require('react-bootstrap/MenuItem'),
	Icon = require('../helper/icon.jsx');

var sorts = {
	'recent': "Newest to Oldest",
	'oldest': "Oldest to Newest",
	'expensive': "Price: High to Low",
	'cheapest': "Price: Low to High"
};

module.exports = React.createClass({
	displayName: "SearchTitle",

	renderSortSelect: function () {
		var sortItems = map(sorts, function (text, key) {
			return (<MenuItem key={"search-sort" + key} eventKey={key}>{text}</MenuItem>);
		});
		return (
			<DropdownButton title={sorts[this.props.sort]} onSelect={this.props.onSortChange}>
				{sortItems}
			</DropdownButton>
		)
	},

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
					<div className="sort-by">
						<p>Sort by:</p>
						{this.renderSortSelect()}
					</div>
					<div className="chat-search">
						{this.renderInput()}
					</div>
				</div>
			</div>
		);
	}
});