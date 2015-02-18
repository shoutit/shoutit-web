/** @jsx React.DOM */

var React = require('react'),
	Icon = require('../../../helper/icon.jsx')

module.exports = React.createClass({
	displayName: "ShoutActions",

	render: function() {
		return (
			<ul className="book col-md-6">
				<li>
					<Icon name="b1"/>
				</li>
				<li>
					<Icon name="b2"/>
				</li>
				<li>
					<Icon name="b3"/>
				</li>
			</ul>
		);
	}
});