/** @jsx React.DOM */

var React = require('react');

var LocSelect = React.createClass({
	render: function () {
		return (
			<div className="country select-style">
				<select id="id_select" className="selectpicker">
					<option>Dubai</option>
					<option>Aachen</option>
					<option>Berlin</option>
				</select>
			</div>
		);
	}
});

module.exports = LocSelect;