import React from 'react';
import {State} from 'react-router';
import {RouteHandler} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Loader, Clear, Icon} from '../helper';
import {Col} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';
import DocumentTitle from 'react-document-title';
import ProfileActions from './profileActions.jsx'
import ProfileImage from './profileImage.jsx';
import ProfileDetails from './profileDetails.jsx';

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin("users"), State],

	displayName: "Profile",

	statics: {
		fetchData(client, session, params) {
			return client.users().get(session, params.username);
		}
	},

	getStateFromFlux() {
		return this.getFlux().store("users").getState();
	},

	renderSettingsLink(user, linkParams) {
		return user.is_owner ? (
			<NavItemLink to="settings" params={linkParams}>
				<Icon name="set"/>
				Profile Settings
				<span></span>
			</NavItemLink>
		) : null;
	},

	render() {
		let username = this.getParams().username,
			user = this.state.users[username];

		if (user) {
			let linkParams = {username: encodeURIComponent(user.username)},
				listenerCount = this.state.listeners[username] ?
					this.state.listeners[username].length :
					user.listeners_count,
				listeningCountUsers = this.state.listening[username] && this.state.listening[username].users ?
					this.state.listening[username].users.length :
					user.listening_count.users,
				listeningCountTags = this.state.listening[username] && this.state.listening[username].tags ?
					this.state.listening[username].tags.length :
					user.listening_count.tags;

			return (
				<DocumentTitle title={user.name + " - Shoutit"}>
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">

							<ProfileImage image={user.image} name={user.name} username={user.username || " "}/>
							<ProfileActions user={user} isUserLogged={Boolean(this.state.user)} status={this.state.status} flux={this.getFlux()} />
							<ProfileDetails location={user.location} joined={user.date_joined}/>
							<Clear/>
							<ul>
								{this.renderSettingsLink(user, linkParams)}
								<NavItemLink to="useroffers" params={linkParams}>
									<Icon name="lis2"/>
									User's Offers
									<span/>
								</NavItemLink>
								<NavItemLink to="userrequests" params={linkParams}>
									<Icon name="lis3"/>
									User's Requests
									<span/>
								</NavItemLink>
								<NavItemLink to="listeners" params={linkParams}>
									<Icon name="lis"/>
									Listeners
									<span>{listenerCount}</span>
								</NavItemLink>
								<NavItemLink to="listening" params={linkParams}>
									<Icon name="lis1"/>
									Listening
									<span>{listeningCountUsers + "|" + listeningCountTags }</span>
								</NavItemLink>
							</ul>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<RouteHandler {...this.state}
								username={username}
								flux={this.getFlux()}
								/>
						</Col>
					</div>
				</DocumentTitle>
			);
		} else if (user === null) {
			return (
				<DocumentTitle title="Not Found - Shoutit">
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<h3>User not found.</h3>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
						</Col>
					</div>
				</DocumentTitle>
			);
		} else {
			return (
				<DocumentTitle title="Loading - Shoutit">
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<Loader/>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<Loader/>
						</Col>
					</div>
				</DocumentTitle>
			);
		}
	},

	componentDidUpdate() {
		this.loadUser();
	},

	componentDidMount() {
		this.loadUser();
	},

	loadUser() {
		let username = this.getParams().username,
			user = this.state.users[username];

		if (!this.state.loading && !user && user !== null) {
			this.getFlux().actions.loadUser(username);
		}
	}
});
