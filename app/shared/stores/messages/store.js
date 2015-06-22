/**
 * Created by Philip on 22.06.2015.
 */

import Fluxxor from 'fluxxor';

import consts from './consts';

const LOG_TAG = "[Pusher]";

let MessagesStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			userId: null,
			presenceChannel: null
		};

		if (props.user) {
			this.state.userId = props.user.id;
		}
	},

	setPusherClient(pusherClient) {
		this.pusherClient = pusherClient;
		if (this.state.userId) {
			let channelId = 'presence-u-' + this.state.userId;
			this.state.presenceChannel = this.pusherClient.subscribe(channelId);
			this.state.presenceChannel.bind('pusher:subscription_succeeded', function () {
				console.log(LOG_TAG, "Subscribed:", channelId);
				this.bindPusherEvents();
			}.bind(this));
		}
	},

	bindPusherEvents() {
		this.state.presenceChannel.bind("new_message", this.onNewMessage.bind(this));
		this.state.presenceChannel.bind("new_listen", this.onNewListen.bind(this));
		this.state.presenceChannel.bind("profile_change", this.onProfileChange.bind(this));
	},

	onNewMessage(message) {
		console.log(LOG_TAG, "[new_message]", message)
	},

	onNewListen(user) {
		console.log(LOG_TAG, "[new_listen]", user);
	},

	onProfileChange(user) {
		console.log(LOG_TAG, "[profile_change]", user);
	},

	serialize() {
		return JSON.stringify(this.state);
	},

	hydrate(json) {
		this.state = JSON.parse(json);
	},

	getState() {
		return this.state;
	}
});

export default MessagesStore;
