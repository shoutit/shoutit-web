/** @jsx React.DOM */

var React = require('react'),
	ReactBootstrap = require('react-bootstrap'),
	DropdownButton = ReactBootstrap.DropdownButton,
	ButtonToolbar = ReactBootstrap.ButtonToolbar,
	MenuItem = ReactBootstrap.MenuItem;

var LocSelect = React.createClass({
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
		var title = this.props.countries[this.props.default];

		var items = [];

		for (var country in this.props.countries) {
			if (this.props.countries.hasOwnProperty(country)) {
				items.push(<MenuItem key={country} eventKey={country}>{this.props.countries[country]}</MenuItem>);
			}
		}
		// selectpicker bla bla bli
		return (
			<div className="country select-style">
				<ButtonToolbar>
					<DropdownButton onClick={this.onClick} key="countrySelect" title={title} id="id_select" className="selectpicker bla bli">
						{items}
					</DropdownButton>
				</ButtonToolbar>
			</div>
		);
	},

	onClick: function(e) {
		console.log("yolo");
	}
});

module.exports = LocSelect;