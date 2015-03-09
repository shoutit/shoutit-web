var React = require('react'),
	Col = require('react-bootstrap/Col'),
	ShoutHeader = require('./shout/header.jsx'),
	ShoutBody = require('./shout/body.jsx'),
	moment = require('moment'),
	ViewportSensor = require('../../misc/ViewportSensor.jsx');

module.exports = React.createClass({
	displayName: "Shout",

	render: function () {
		console.log(this.props.shout);

		var right = this.props.index % 2 !== 0;
		var shout = this.props.shout;

		var body = <ShoutBody logoRight={right} shout={shout}/>;

		if (this.props.last) {
			body = <ViewportSensor onChange={this.props.last}>{body}</ViewportSensor>;
		}

		return (
			<section>
				<Col xs={12} md={12}>
					<ShoutHeader agoText={moment.unix(shout.date_published).fromNow()} logoRight={right} logoSrc={shout.user.image}/>
					{body}
				</Col>
			</section>
		);
	}
});