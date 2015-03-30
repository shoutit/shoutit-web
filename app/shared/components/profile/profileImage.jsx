var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link;

module.exports = React.createClass({
	displayName: "ProfileImage",

	render: function () {
		return (
			<div className="profile-img">
				<img src={this.props.image}/>
				<h4>{this.props.name}</h4>
				<Link to="user" params={{username: this.props.username}} title="Username">
					{"(" + this.props.username + ")"}
				</Link>
			</div>
		);
	}
});