

var React = require('react'),
	MenuItemLink = require('react-router-bootstrap').MenuItemLink,
	Col = require('react-bootstrap/Col'),
	Link = require('react-router');

var UserImage = require('../../../user/userImage.jsx');

module.exports = React.createClass({
	displayName: "UnreadMessageList",

	getDefaultProps: function () {
		return {
			user: {
				image: "/img/dummies/person1-icon.png",
				name: "Adriana Lima",
				online: false
			},
			message: {
				id: "dummy",
				text: "Lorem ipsum dolor sit amet, his interesset is cludaturque te, id pro timeam..."
			}
		}
	},

	render: function () {
		var circleClasses = "small-circle2 " + this.props.user.online ? "active" : "";

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