

var React = require('react'),
	MenuItem = require('react-bootstrap').MenuItem,
	Col = require('react-bootstrap').Col,
	Link = require('react-router').Link;

module.exports = React.createClass({
	displayName: "MessageDropdownHeader",

	getDefaultProps: function () {
		return {
			unread: 0
		}
	},

	render: function () {
		return (
			<MenuItem className="nav-setting" header={true}>
				<Col xs={5} md={6}>
					<span>{"inbox (" + this.props.unread + ")"}</span>
				</Col>
				<Col xs={7} md={6}>
					<Link to="message" params={{msgId: "new"}}>Send a new message</Link>
				</Col>
			</MenuItem>
		);
	}
});