var React = require('react');

module.exports = React.createClass({
	displayName: "Spinner",

	propTypes: {
		config: React.PropTypes.object,
		stopped: React.PropTypes.bool
	},

	componentDidMount: function () {
		var Spinner = require('spin.js');
		this.spinner = new Spinner(this.props.config);
		this.spinner.spin(this.refs.container.getDOMNode());
	},

	componentWillReceiveProps: function (newProps) {
		if (newProps.stopped === true && !this.props.stopped) {
			this.spinner.stop();
		} else if (!newProps.stopped && this.props.stopped === true) {
			this.spinner.spin();
		}
	},

	componentWillUnmount: function () {
		this.spinner.stop();
	},

	render: function () {
		return (
			<span ref="container"></span>
		);
	}
});