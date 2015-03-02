var React = require('react');

module.exports = React.createClass({
	displayName: "UserImage",

	getDefaultProps: function () {
		return {
			name: "Dummy",
			image: "/img/dummies/person-icon.png"
		}
	},

	render: function () {
		return (
			<div title={this.props.name} style={{
				"height": "51px",
				"width": "51px",
				"backgroundImage": "url('" + this.props.image + "')",
				"borderRadius": "25px",
				"backgroundSize": "auto 51px",
				"backgroundRepeat": "no-repeat"
			}}/>
		);
	}
});