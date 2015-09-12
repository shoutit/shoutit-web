import Fluxxor from 'fluxxor';
import url from 'url';

import consts from './consts';
import client from './client';

const PAGE_SIZE = 10;
const REQUEST_TYPE = "request";
const OFFER_TYPE = "offer";
const ALL_TYPE = "all";

function initUserShoutEntry() {
	return {
		offers: null,
		nextOffersPage: null,
		maxOffers: null,
		requests: null,
		nextRequestsPage: null,
		maxRequest: null
	};
}

function initUserListeningEntry() {
	return {
		users: null,
		tags: null
	};
}

var UserStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			user: null,
			users: {},
			listeners: {},
			listening: {},
			shouts: {},
			loading: false,
			showDownloadPopup: false,
			logingIn: false,
			loginFailed: null,
			signupStatus: {},
			forgetResult: null,
			editors: {}
		};

		if (props.loggedUser) {
			let loggedUsername = props.loggedUser.username;
			this.state.users[loggedUsername] = props.loggedUser;
			this.state.user = loggedUsername;
		}

		if (props.user) {
			let username = props.user.username;

			this.state.users[username] = props.user;
			this.state.shouts[username] = initUserShoutEntry();
			this.state.listeners[username] = null;
			this.state.listening[username] = initUserListeningEntry();

			if (props.useroffers) {
				let userShouts = this.state.shouts[username],
					loadedOffers = props.useroffers;
				userShouts.offers = loadedOffers.results;
				userShouts.maxOffers = loadedOffers.count;
				userShouts.nextOffersPage = this.parseNextPage(loadedOffers.next);
			}

			if (props.userrequests) {
				let userShouts = this.state.shouts[username],
					loadedRequests = props.userrequests;
				userShouts.requests = loadedRequests.results;
				userShouts.maxRequest = loadedRequests.count;
				userShouts.nextRequestsPage = this.parseNextPage(loadedRequests.next);
			}

			if (props.listeners) {
				this.state.listeners[username] = props.listeners.results;
			}

			if (props.listening) {
				this.state.listening[username].users = props.listening.users;
				this.state.listening[username].tags = props.listening.tags;
			}
		}

		this.router = props.router;

		this.bindActions(
			consts.RESEDND_EMAIL_VERIF, this.onResendEmail,
			consts.FORGET_RESULT, this.onForgetResult,
			consts.SIGNUP_SUCCESS, this.onSignupSuccess,
			consts.SIGNUP_FAIL, this.onSignupFail,
			consts.LOGIN, this.onLogin,
			consts.LOGIN_FB_ERROR, this.onLoginFBError,
			consts.LOGOUT, this.onLogout,
			consts.INFO_CHANGE, this.onInfoChange,
			consts.INFO_SAVE, this.onInfoSave,
			consts.PASS_CHANGE, this.onPassChange,
			consts.LISTEN, this.onListen,
			consts.STOP_LISTEN, this.onStopListen,
			consts.LOAD_USER_LISTENERS, this.onLoadUserListeners,
			consts.LOAD_USER_LISTENING, this.onLoadUserListening,
			consts.LOAD_USER, this.onLoadUser,
			consts.LOAD_USER_SHOUTS, this.onLoadUserShouts,
			consts.LOAD_MORE_USER_SHOUTS, this.onLoadMoreUserShouts,
			consts.SHOW_DOWNLOAD_POPUP, this.onShowDownloadPopup,
			consts.HIDE_DOWNLOAD_POPUP, this.onHideDownloadPopup
		);
	},

	parseNextPage(nextUrl) {
		if (nextUrl) {
			var parsed = url.parse(nextUrl, true);
			return Number(parsed.query.page);
		}
		return null;
	},

	onSignupSuccess(data) {
		let loggedUser = data;

		this.state.users[loggedUser.username] = loggedUser;
		this.state.user = loggedUser.username;
		this.state.signupStatus = {name:loggedUser.first_name, email:loggedUser.email};
		this.state.signupStatus.status = consts.SIGNUP_SUCCESS;

		this.emit("change");
		this.emit("login");
	},

	onSignupFail(data) {
		this.state.signupStatus = data;
		this.state.signupStatus.status = consts.SIGNUP_FAIL;
		this.emit("change");
	},

	onForgetResult(payload) {
		if (payload.email) {
			this.state.forgetResult = payload.email[0];
		} else if (payload.success) {
			this.state.forgetResult = payload.success;
		}
		this.emit("change");
	},

	onLogin(payload) {
		this.state.logingIn = true;
		this.emit("change");

		client.login(payload.token, payload.type)
			.end(function (err, res) {
				if (err) {
					this.state.logingIn = false;
					this.state.loginFailed = null;
					this.emit("change");
					console.error(err);
				} else {
					let loggedUser = res.body;
					if (typeof loggedUser.username !== 'undefined') {
						this.state.users[loggedUser.username] = loggedUser;
						this.state.user = loggedUser.username;
						this.state.logingIn = false;
						this.state.loginFailed = null;
						this.emit("change");
						this.emit("login");
						this.router.transitionTo('app');
					} else { // login failed
						this.state.loginFailed = 'native_not_authorized';
						this.state.logingIn = false;
						this.emit("change");
					}
					
				}
			}.bind(this));
	},

	onLoginFBError() {
		this.state.loginFailed = 'no_fb_email';
		this.emit("change");
	},

	onLogout() {
		client.logout()
			.end(function (err, res) {
				if (err) {
					console.error(err);
				} else if (res.status === 200 && res.body.loggedOut) {
					this.state.user = null;
					this.emit("change");
					this.emit("logout");
					this.router.transitionTo('app');
				}
			}.bind(this));
	},

	onInfoChange(payload) {
		if (this.state.user[payload.field]) {
			this.state.user[payload.field] = payload.value;
		}
		this.emit("change");
	},

	onPassChange(dataPackage) {
		this.state.editors["password"] = {};
		this.state.editors["password"].loading = true;
		this.emit("change");

		client.changePass(dataPackage).end(function(err,res) {
			if(err) {
				console.log(err);
				this.state.editors["password"].loading = false;
			} else {
				if (res.body.success) {
					this.state.editors["password"] = {loading: false,msg:res.body.success};
				} else {
					// find errors
					if (res.body)
					this.state.editors["password"] = 
						{loading: false,msg:'Current password does not match!'};
				}	
			}
			this.emit("change");
		}.bind(this));
	},


	onInfoSave(payload) {
		if (this.state.users[this.state.user][payload.field]) {
			var patch = {};

			patch[payload.field] = payload.value;

			client.update(patch).end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					console.log(res.body);
					var loggedUser = res.body;
					this.state.users[loggedUser.username] = loggedUser;
					this.state.user = loggedUser.username;
					this.state.loading = false;
					this.emit("change");
				}
			}.bind(this));
		}
		this.state.loading = true;
		this.emit("change");
	},

	onResendEmail() {
		let user = this.state.users[this.state.user];
		if(user) {
			client.resendEmail(user.email).end();
		}
		
	},

	onListen(payload) {
		var username = payload.username;

		client.listen(username).end(function (err) {
			if (err) {
				console.log(err);
			} else {
				// Refresh Listening List
				this.onLoadUserListening({
					username: this.state.user
				});
			}
		}.bind(this));
	},

	onStopListen(payload) {
		var username = payload.username;

		client.stopListen(username)
			.end(function (err) {
				if (err) {
					console.log(err);
				} else {
					// Refresh Listening List
					this.onLoadUserListening({
						username: this.state.user
					});
				}
			}.bind(this));
	},

	onLoadUserListeners(payload) {
		var username = payload.username;

		client.getListeners(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.state.listeners[username] = res.body.results;
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserListening(payload) {
		var username = payload.username;

		client.getListening(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.state.listening[username] = {
					users: res.body.users,
					tags: res.body.tags
				};
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserShouts(payload) {
		var username = payload.username,
			type = payload.type;

		client.loadShouts(username, {
			shout_type: type || ALL_TYPE,
			page_size: PAGE_SIZE
		}).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadUserShoutsSuccess({
					username: username,
					result: res.body,
					type: type
				});
			}
		}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserShoutsSuccess(payload) {
		let username = payload.username,
			type = payload.type;

		if (!this.state.shouts[username]) {
			this.state.shouts[username] = initUserShoutEntry();
		}
		let userShouts = this.state.shouts[username],
			loadedShouts = payload.result;

		if (type === "offer") {
			userShouts.offers = loadedShouts.results;
			userShouts.maxOffers = loadedShouts.count;
			userShouts.nextOffersPage = this.parseNextPage(loadedShouts.next);
		} else if (type === "request") {
			userShouts.requests = loadedShouts.results;
			userShouts.maxRequest = Number(loadedShouts.count);
			userShouts.nextRequestsPage = this.parseNextPage(loadedShouts.next);
		}

		this.state.loading = false;
		this.emit("change");
	},

	onLoadMoreUserShouts(payload) {
		let username = payload.username,
			type = payload.type;

		let userShouts = this.state.shouts[username],
			nextPage;

		if (type === OFFER_TYPE) {
			nextPage = userShouts.nextOffersPage;
		} else if (type === REQUEST_TYPE) {
			nextPage = userShouts.nextRequestsPage;
		}

		if (nextPage) {
			client.loadShouts(username, {
				shout_type: type || ALL_TYPE,
				page_size: PAGE_SIZE,
				page: nextPage
			}).end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					this.onLoadMoreUserShoutsSuccess({
						username: username,
						result: res.body,
						type: type
					});
				}
			}.bind(this));
			this.state.loading = true;
			this.emit("change");
		}
	},

	onLoadMoreUserShoutsSuccess(payload) {
		let username = payload.username,
			type = payload.type;

		if (!this.state.shouts[username]) {
			this.state.shouts[username] = initUserShoutEntry();
		}
		let userShouts = this.state.shouts[username],
			loadedShouts = payload.result;

		if (type === "offer") {
			userShouts.offers = userShouts.offers.append(loadedShouts.results);
			userShouts.maxOffers = Number(loadedShouts.count);
			userShouts.nextOffersPage = this.parseNextPage(loadedShouts.next);
		} else if (type === "request") {
			userShouts.requests = userShouts.requests.append(loadedShouts.results);
			userShouts.maxRequest = Number(loadedShouts.count);
			userShouts.nextRequestsPage = this.parseNextPage(loadedShouts.next);
		}

		this.state.loading = false;
		this.emit("change");
	},

	onLoadUser(payload) {
		var username = payload.username;

		client.get(username)
			.end(function (err, res) {
				if (err || res.status !== 200) {
					this.onLoadUserFailed({
						username: username
					});
				} else {
					this.onLoadUserSuccess({
						username: username,
						res: res.body
					});
				}
			}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserSuccess(payload) {
		this.state.users[payload.username] = payload.res;
		this.state.shouts[payload.username] = initUserShoutEntry();
		this.state.listening[payload.username] = initUserListeningEntry();
		this.state.loading = false;
		this.emit("change");
	},

	onLoadUserFailed(payload) {
		this.state.users[payload.username] = null;
		this.state.loading = false;
		this.emit("change");
	},

	onShowDownloadPopup() {
		this.state.showDownloadPopup = true;
		this.emit("change");
	},

	onHideDownloadPopup() {
		this.state.showDownloadPopup = false;
		this.emit("change");
	},

	serialize() {
		return JSON.stringify(this.state);
	},

	hydrate(json) {
		this.state = JSON.parse(json);
	},

	getState() {
		return this.state;
	},

	getLoggedUser() {
		return this.state.users[this.state.user];
	}
});

export default UserStore;
