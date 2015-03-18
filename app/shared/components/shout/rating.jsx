var React = require('react'),
	Icon = require('../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "Rating",

	getDefaultProps: function () {
		return {
			max: 5,
			rating: 3
		}
	},

	renderStars: function () {
		var filled = Math.floor(this.props.rating),
			stars = [];
		for (var i = 0; i < max; i++) {
			if (i < filled) {
				stars.push(<Icon name="start-1" />);
			} else {
				stars.push(<Icon name="b1" />);
			}
		}
	},

	render: function () {
		return (
			<div className="dot2">
				{this.renderStars()}
			</div>
		);
	}
});