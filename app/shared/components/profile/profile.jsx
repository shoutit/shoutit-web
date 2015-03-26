var React = require('react'),
	Router = require('react-router'),
	RouteHandler = Router.RouteHandler,
	Col = require('react-bootstrap/Col'),
	Nav = require('react-bootstrap/Nav'),
	NavItemLink = require('react-router-bootstrap').NavItemLink;

var Clear = require('../helper/clear.jsx'),
	Icon = require('../helper/icon.jsx');

var ProfileImage = require('./profileImage.jsx'),
	ProfileDetails = require('./profileDetails.jsx');

module.exports = React.createClass({
	displayName: "Profile",

	render: function () {
		return (
			<div className="profile">
				<Col xs={12} md={3} className="profile-left">
					<ProfileImage/>
					<ProfileDetails/>
					<Clear/>
					<ul>
						<NavItemLink to="profilesettings">
							<Icon name="set"/>
							Profile Settings
							<span></span>
						</NavItemLink>
						<NavItemLink to="profilelisteners">
							<Icon name="lis"/>
							Listeners
							<span>0</span>
						</NavItemLink>
						<NavItemLink to="profilelistening">
							<Icon name="lis1"/>
							Listening
							<span>0</span>
						</NavItemLink>
						<NavItemLink to="profileoffers">
							<Icon name="lis2"/>
							User's Offers
							<span>0</span>
						</NavItemLink>
						<NavItemLink to="profilerequests">
							<Icon name="lis3"/>
							User's Requests
							<span>0</span></NavItemLink>

					</ul>
				</Col>
				<Col xs={12} md={9} className="pro-right-padding">
					<RouteHandler/>
				</Col>
			</div>
		);
	}
});