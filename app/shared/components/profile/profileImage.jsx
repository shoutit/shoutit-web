var React = require('react');

module.exports = React.createClass({
	displayName: "ProfileImage",

	getDefaultProps: function() {
		return {
			profileImage: "/img/dummies/profile1.png",
			name: "Kevin Richardos"
		}
	},

	render: function () {
		return (
			<div className="profile-img">
				<img src={this.props.profileImage}/>
				<h4>{this.props.name}</h4>
			</div>
		);
	}
});