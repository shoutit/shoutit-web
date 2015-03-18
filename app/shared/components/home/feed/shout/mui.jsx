var React = require('react'),
	PureRenderMixin = require('react/addons').addons.PureRenderMixin,
	Icon = require('../../../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "Mui",
	mixins: [PureRenderMixin],

	getDefaultProps: function () {
		return {
			right: false
		};
	},

	render: function () {
		return (
			<Icon className={this.props.right ? "mui1" : "mui"} name={this.props.right ? "mui1" : "mui"}/>
		);
	}
});