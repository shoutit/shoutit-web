import React from 'react';
import {MenuItem, Col} from 'react-bootstrap';
import {Link} from 'react-router';

export default React.createClass({
	displayName: "MessageDropdownHeader",

	getDefaultProps() {
		return {
			unread: 0
		};
	},

	render() {
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
