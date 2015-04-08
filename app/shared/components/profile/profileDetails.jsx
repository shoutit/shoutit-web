var React = require('react'),
	moment = require('moment');

var Icon = require('../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "ProfileDetails",

	render: function () {
		return (
			<div className="profile-details">
				<div className="birth">
					<Icon name="cal"/>
					<p>
						<span>Date joined: </span>
						{moment.unix(this.props.joined).calendar()}
					</p>
				</div>
				<div className="birth">
					<Icon name="loc"/>
					<p>
						<span>Location: </span>
						{this.props.location.city + " - " + this.props.location.country}
					</p>
				</div>
			</div>
		);
	}
});