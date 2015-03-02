var React = require('react'),
	Col = require('react-bootstrap/Col'),
	ShoutHeader = require('./shout/header.jsx'),
	ShoutBody = require('./shout/body.jsx'),
	moment = require('moment');

module.exports = React.createClass({
	displayName: "Shout",

	render: function () {
		var right = this.props.index % 2 !== 0;
		var shout = this.props.shout;

		return (
			<section>
				<Col xs={12} md={12}>
					<ShoutHeader agoText={moment.unix(shout.date_published).fromNow()} logoRight={right} logoSrc={shout.user.image}/>
					<ShoutBody logoRight={right} shout={shout}/>
				</Col>
			</section>
		);
	}
});