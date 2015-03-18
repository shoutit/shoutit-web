var React = require('react'),
	Holder = require('holderjs');

module.exports = React.createClass({
	displayName: "Image",

	getDefaultProps: function () {
		return {
			holderSrc: "holder.js/",
			holderSize: "200x300",
			holderText: "Loading..."
		}
	},

	render: function () {
		return (
			<img ref="image" src={this.props.holderSrc + this.props.holderSize + "/text:" + this.props.holderText} />
		);
	},

	componentDidMount: function () {
		Holder.run({
			images: [this.refs.image.getDOMNode()]
		});
	}


});