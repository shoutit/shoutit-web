import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import statuses from '../../consts/statuses.js';
import NotificationSystem from 'react-notification-system';

var {LISTENING_CLICKED, BUTTON_LISTENED, BUTTON_UNLISTENED} = statuses;

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin('users')],
	displayName: "TagProfileActions",
	_notificationSystem: null,

	getInitialState() {
		return {
			isLoading: false
		}
	},

	getStateFromFlux() {
		return this.getFlux().store('users').getState();
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
		this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUpdate() {
		let status = this.props.status;
		let tag = this.props.tag;

		// statuses from flux
		switch(status) {
		case BUTTON_LISTENED:
			this.displayNotif(`You are listening to ${tag.name}`);
			this.setState({isLoading: false});
			break;
		case BUTTON_UNLISTENED:
			this.displayNotif(`You are no longer listening to ${tag.name}`);
			this.setState({isLoading: false});
			break;
		case LISTENING_CLICKED:
			this.setState({isLoading: true});
			break;
		}
	},

	render() {
		let tag = this.props.tag,
			status = this.props.status,
			isLoading = this.state.isLoading,
			btn;

		// no need to load Listening button if user is not logged in
		if (this.state.user) {
			let isListening = tag.is_listening;

			let title = isListening? "Listening": "Listen";
			let style = isListening? "shoutit-btn listen": "shoutit-btn not-listen";

			if(isLoading) {
				title = "Loading";
				style = "shoutit-btn loading";
			}

			// The main button of this compnent
			btn = <span className={style} onClick={this.toggleListen}>{title}</span>;
		}

		return (
			<div className="profile-details">
				<div className="birth">
					{btn}
				</div>
				<NotificationSystem ref="notificationSystem" />
			</div>
		);
	},

	toggleListen() {
		let tag = this.props.tag;

		if (tag.is_listening) {
			this.props.flux.actions.stopListenTag(tag.name);
		} else {
			this.props.flux.actions.listenTag(tag.name);
		}
	}
});
