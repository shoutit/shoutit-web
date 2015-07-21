import React from 'react';
import {MenuItemLink} from 'react-router-bootstrap';
import {Col} from 'react-bootstrap';
import {Link} from 'react-router';

import UserImage from '../../../user/userImage.jsx';

export default React.createClass({
	displayName: "UnreadMessageList",

	render() {
		let circleClasses = "small-circle2 " + this.props.user.online ? "active" : "";

		return (
			<MenuItemLink to="message" params={{msgId: this.props.message.id}}>
				<Col xs={2} md={2}>
					<UserImage name={this.props.user.name} image={this.props.user.image}/>
				</Col>
				<Col xs={10} md={10}>
					<span className="person-name">{this.props.user.name}</span>
					<span className={circleClasses}>
						<p>{this.props.message.text}</p>
					</span>
				</Col>
			</MenuItemLink>
		);
	}
});
