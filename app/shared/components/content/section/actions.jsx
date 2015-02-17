/** @jsx React.DOM */

var React = require('react');

module.exports = SectionActions = React.createClass({
	render: function() {
		return (
			<ul className="book col-md-6">
				<li>
					<img src="img/b1.png"/>
				</li>
				<li>
					<img src="img/b2.png"/>
				</li>
				<li>
					<img src="img/b3.png"/>
				</li>
			</ul>
		);
	}
});