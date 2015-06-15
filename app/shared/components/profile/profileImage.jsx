var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link;

var Image = require('../helper/image.jsx');

module.exports = React.createClass({
	displayName: "TagProfileImage",

	render: function () {
		return (
			<div className="profile-img">
				<Image infix="user" size="medium" src={this.props.image}/>
				<h4>{this.props.name}</h4>
				<Link to="user" params={{username: encodeURIComponent(this.props.username)}} title="Username">
					{"(" + this.props.username + ")"}
				</Link>
			</div>
		);
	}
});