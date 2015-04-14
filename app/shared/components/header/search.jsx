var React = require('react'),
	Input = require('react-bootstrap/Input'),
	Icon = require('../helper/icon.jsx'),
	Button = require('react-bootstrap/Button'),
	DropdownButton = require('react-bootstrap/DropdownButton'),
	MenuItem = require('react-bootstrap/MenuItem');

module.exports = React.createClass({

	displayName: "SearchInput",

	getDefaultProps: function () {
		return {
			countries: {
				"dub": "Dubai",
				"aac": "Aachen",
				"ber": "Berlin"
			},
			default: "dub"
		}
	},

	render: function () {
		var searchAddon = (
			<Button className="searchButton" bsStyle="link">
				<Icon name="search-icon"/>
			</Button>
		);

		var title = this.props.countries[this.props.default];

		var items = [];

		for (var country in this.props.countries) {
			if (this.props.countries.hasOwnProperty(country)) {
				items.push(<MenuItem key={country} eventKey={country}>{this.props.countries[country]}</MenuItem>);
			}
		}

		var buttonBefore = (
			<DropdownButton onClick={this.onClick} key="countrySelect" title={title} className="selectpicker bla bli" >
						{items}
			</DropdownButton>
		);

		return (
			<Input
				ref='searchInput'
				type="text"
				buttonBefore={buttonBefore}
				addonAfter={searchAddon}
				onChange={this.props.onChange}
				onFocus={this.props.onFocus}
				onBlur={this.props.onBlur}
				value={this.props.term}
			/>
		);
	}
});