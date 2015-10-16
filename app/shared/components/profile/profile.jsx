import React from 'react';
import {State} from 'react-router';
import {RouteHandler} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Loader, Clear, Icon} from '../helper';
import {Col} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';
import DocumentTitle from 'react-document-title';
import ProfileImage from './profileImage.jsx';
import ProfileDetails from './profileDetails.jsx';
import ListenButton from '../helper/listenButton.jsx';
import NotificationSystem from 'react-notification-system';

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin("users"), State],
	_notificationSystem: null,
	displayName: "Profile",

	statics: {
		fetchData(client, session, params) {
			return client.users().get(session, params.username);
		}
	},

	getStateFromFlux() {
		return this.getFlux().store("users").getState();
	},

	displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
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

		if (user && user.location) {
			let linkParams = {username: encodeURIComponent(user.username)},
				listens = this.state.listens[username],
				listeningCountTags, listenerCount, listeningCountUsers;

			if (listens) {
				listenerCount = user.listeners_count;
				listeningCountUsers = user.listening_count.users;
				listeningCountTags = user.listening_count.tags;
			}

			return (
				<DocumentTitle title={user.name + " - Shoutit"}>
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<ProfileImage image={user.image} name={user.name} username={user.username || " "}/>
							<ListenButton username={user.username} updateListeningCount={true} onChange={this.handleListen} flux={this.getFlux()} />
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
									<span>{listeningCountUsers}</span>
								</NavItemLink>
							</ul>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<RouteHandler {...this.state}
								username={username}
								flux={this.getFlux()}
								/>
						</Col>
						<NotificationSystem ref="notificationSystem" />
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
		this._notificationSystem = this.refs.notificationSystem;
	},

	componentDidMount() {
		this.loadUser();
		this._notificationSystem = this.refs.notificationSystem;
	},

	handleListen(ev) {
		if(ev.isListening) {
			this.displayNotif(`You are listening to ${ev.username}`);
		} else {
			this.displayNotif(`You are no longer listening to ${ev.username}`, 'warning');
		}
	},

	loadUser() {
		let username = this.getParams().username,
			user = this.state.users[username],
			listens = this.state.listens[username],
			// condition
			noInfoLoaded = (!listens || !user || !user.location) && !this.state.loading;

		if(noInfoLoaded){
			this.getFlux().actions.loadUser(username);
		}
		
		
	}
});
