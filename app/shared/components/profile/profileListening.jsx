import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';
import ListenerRow from './listenerRow.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import NotificationSystem from 'react-notification-system';

export default React.createClass({
	displayName: "ProfileListening",
	_notificationSystem: null,

	statics: {
		fetchData(client, session, params) {
			return client.users().getListening(session, params.username);
		}
	},

	displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
    },

	componentDidMount() {
		let username = this.props.username;
		this.props.flux.actions.loadUserListening(username);

		this._notificationSystem = this.refs.notificationSystem;
	},

	render() {
		
		let p = this.props,
			username = p.username,
			loggedUser = p.user,
			listening = p.listens[username]? p.listens[username].listening.list : null,
			listeningUsers = listening.map(item => p.users[item]),
			flux = p.flux,
			listeningChildren, stat;

		if (listeningUsers) {
			listeningChildren = listening.length ? 
				listeningUsers.map((listener, i) => {
					return (
						<ListenerRow key={"listening-" + username + '-' + i} user={listener}
								onChange={this.handleChange} flux={flux}/>
					);
				})
				:
				!this.props.loading? <h4>You aren't listening to any other user.</h4>: [];
		} else {
			listeningChildren = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>You are listening to:</p>
					</div>
					<Clear/>

					<div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
						{listeningChildren}
						{this.renderViewportSensor()}
					</div>
				</div>
				<NotificationSystem ref="notificationSystem" />
			</Col>
		);
	},

	handleChange(ev) {
		if(ev.isListening) {
			this.displayNotif(`You are listening to ${ev.username}`);
		} else {
			this.displayNotif(`You are no longer listening to ${ev.username}`, 'warning');
		}
	},

	renderViewportSensor() {
		if(this.props.loading) {
			return (
				<section>
						<Col xs={12} md={12}>
							<Loader />
						</Col>
				</section>);
		} else {
			return (
				<section>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
					</Col>
				</section>);
		}
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.loadMore();
		}
	},

	loadMore() {
		this.props.flux.actions.loadMoreUserListening(this.props.username);
	}
});
