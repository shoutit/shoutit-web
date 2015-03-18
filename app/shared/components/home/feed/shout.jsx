var React = require('react'),
	PureRenderMixin = require('react/addons').addons.PureRenderMixin,
	Col = require('react-bootstrap/Col'),
	ShoutHeader = require('./shout/header.jsx'),
	ShoutBody = require('./shout/body.jsx'),
	moment = require('moment'),
	ViewportSensor = require('../../misc/ViewportSensor.jsx');

module.exports = React.createClass({
	displayName: "Shout",
	mixins:[PureRenderMixin],

	alignRight: function() {
		return this.props.index % 2 !== 0;
	},

	agoText: function() {
		return moment.unix(this.props.shout.date_published).fromNow()
	},

	render: function () {
		var shout = this.props.shout,
			ago = this.agoText();

		var body = <ShoutBody logoRight={this.alignRight()} shout={shout}/>;

		if (this.props.last) {
			body = <ViewportSensor onChange={this.props.last}>{body}</ViewportSensor>;
		}

		return (
			<section>
				<Col xs={12} md={12}>
					<ShoutHeader agoText={ago} logoRight={this.alignRight()} logoSrc={shout.user.image}/>
					{body}
				</Col>
			</section>
		);
	}
});