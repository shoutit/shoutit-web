var React = require('react'),
	Router = require('react-router'),
	NavigationMixin = Router.Navigation,
	RouteHandler = Router.RouteHandler,
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Col = require('react-bootstrap/Col'),
	Nav = require('react-bootstrap/Nav'),
	NavItemLink = require('react-router-bootstrap').NavItemLink;

var Clear = require('../helper/clear.jsx'),
	Icon = require('../helper/icon.jsx'),
	DocumentTitle = require('react-document-title');

var ProfileImage = require('./profileImage.jsx'),
	ProfileDetails = require('./profileDetails.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("user"), NavigationMixin],

	displayName: "Profile",

	getStateFromFlux: function () {
		return this.getFlux().store("user").getState();
	},

	render: function () {
		var user = this.state.user;

		return (
			<DocumentTitle title="Profile">
				<div className="profile">
					<Col xs={12} md={3} className="profile-left">
						<ProfileImage image={user.image} name={user.name} username={user.username || " "}/>
						<ProfileDetails location={user.location} joined={user.date_joined}/>
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
								<span>{user.listeners_count}</span>
							</NavItemLink>
							<NavItemLink to="profilelistening">
								<Icon name="lis1"/>
								Listening
								<span>{user.listening_count.users + "|" + user.listening_count.tags }</span>
							</NavItemLink>
							<NavItemLink to="profileoffers">
								<Icon name="lis2"/>
								User's Offers
								<span>0</span>
							</NavItemLink>
							<NavItemLink to="profilerequests">
								<Icon name="lis3"/>
								User's Requests
								<span>0</span>
							</NavItemLink>

						</ul>
					</Col>
					<Col xs={12} md={9} className="pro-right-padding">
						<RouteHandler flux={this.getFlux()} {...this.state}/>
					</Col>
				</div>
			</DocumentTitle>
		);
	}
});