import React from 'react';
import {Col} from 'react-bootstrap';
import findIndex from 'lodash/array/findIndex';
import {Loader, Clear} from '../helper';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import ListenerRow from './listenerRow.jsx';
import NotificationSystem from 'react-notification-system';

export default React.createClass({
	displayName: "ProfileListeners",
	_notificationSystem: null,

	statics: {
		fetchData(client, session, params) {
			return client.users().getListeners(session, params.username);
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
		this.props.flux.actions.loadUserListeners(username);

		this._notificationSystem = this.refs.notificationSystem;
	},

	render() {
		let p = this.props,
			username = p.username,
			listeners = p.listens[username].listeners.list,
			listenersUsers = listeners.map(item => p.users[item]),
			flux = p.flux,
			listenerChildren, stat;

		if (listeners) {
			listenerChildren = listeners.length ?
				listenersUsers.map((listener, i) => {
					return (
						<ListenerRow key={"listener-" + username + '-' + i } user={listener}
									onChange={this.handleChange} flux={flux}/>
					);
				})
				:
				!this.props.loading? <h4>You don't have any listeners</h4>: [];
		} else {
			listenerChildren = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:</p>
					</div>
					<Clear/>

					<div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
						{listenerChildren}
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
		this.props.flux.actions.loadMoreUserListeners(this.props.username);
	}
});
