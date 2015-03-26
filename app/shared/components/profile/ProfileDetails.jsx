var React = require('react'),
	moment = require('moment');

var Icon = require('../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "ProfileDetails",

	getDefaultProps: function () {
		return {
			birthDate: new Date(1980, 2, 1),
			address: "1234 Main Street, 4 Dist,  Anytown, USA 123456"
		}
	},

	render: function () {
		return (
			<div className="profile-details">
				<div className="birth">
					<Icon name="cal"/>
					<p>
						<span>Date of Birth: </span>
						{moment(this.props.birthDate).calendar()}
					</p>
				</div>
				<div className="birth">
					<Icon name="loc"/>
					<p>
						<span>Address: </span>
						{this.props.address}
					</p>
				</div>
			</div>
		);
	}
});