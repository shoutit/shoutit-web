var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link;

var Image = require('../helper/image.jsx');

module.exports = React.createClass({
	displayName: "TagProfileImage",

	render: function () {
		var image = this.props.image ? <Image infix="tag" size="medium" src={this.props.image}/> : "";

		return (
			<div className="profile-img">
				{image}
				<h4>{this.props.name}</h4>
			</div>
		);
	}
});