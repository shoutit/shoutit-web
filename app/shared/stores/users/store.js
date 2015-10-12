import Fluxxor from 'fluxxor';
import url from 'url';
import consts from './consts';
import statuses from '../../consts/statuses';
import locConsts from '../locations/consts';
import client from './client';

const {USER_LISTENING_CLICKED, USER_BUTTON_LISTENED, USER_BUTTON_UNLISTENED} = statuses;

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

// data structure for all listening, listeners and tags
function initUserListenEntry() {
	return {
		listeners: {
			next: null,
			list: []
		},
		listenings: {
			next: null,
			list: []
		},
		tags: {
			next: null,
			list: []
		},
	};
}

var UserStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			user: null,
			users: {},
			listens: {},
			shouts: {},
			loading: false,
			showDownloadPopup: false,
			logingIn: false,
			loginFailed: null,
			signupStatus: {},
			forgetResult: null,
			editors: {},
			verifyResponse: '',
			status: null
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
			this.state.listens[username] = initUserListenEntry();

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
				this.state.listens[username].listeners.list = props.listeners.results;
			}

			if (props.listening) {
				this.state.listens[username].listenings.list = props.listening.users;
				this.state.listens[username].tags.list = props.listening.tags;
			}
		}

		this.router = props.router;

		this.bindActions(
			consts.RESEDND_EMAIL_VERIF, this.onResendEmail,
			consts.VERIFY_EMAIL, this.onEmailVerify,
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
			consts.LOAD_MORE_USER_LISTENERS, this.onLoadMoreUserListeners,
			consts.LOAD_USER_LISTENING, this.onLoadUserListening,
			consts.LOAD_MORE_USER_LISTENING, this.onLoadMoreUserListening,
			consts.LOAD_USER, this.onLoadUser,
			consts.LOAD_USER_SHOUTS, this.onLoadUserShouts,
			consts.LOAD_MORE_USER_SHOUTS, this.onLoadMoreUserShouts,
			consts.SHOW_DOWNLOAD_POPUP, this.onShowDownloadPopup,
			consts.HIDE_DOWNLOAD_POPUP, this.onHideDownloadPopup,
			locConsts.ACQUIRE_LOCATION, this.onAcqireLoc
		);
	},

	parseNextPage(nextUrl) {
		if (nextUrl) {
			var parsed = url.parse(nextUrl, true);
			return Number(parsed.query.page);
		}
		return null;
	},

	saveLocation(loc) {
		let patch = {
			location: {
				longitude: loc.longitude,
				latitude: loc.latitude
			}
		};

		if(this.state.user) {
			client.update({location:loc})
				.end((err, res) => {
					if(err) {
						console.log(err);
					} else {
						this.state.users[this.state.user] = res.body;
						this.emit("change");
					}
				});
		}
	},

	// returns location object if they are properly filled otherwise false
	getLocFromUser() {
		let user = this.state.users[this.state.user];
		if (user === undefined) {
			return false;
		}
		let loc = user.location;
		let isLocationsFilled = loc.country && loc.city && loc.state && loc.latitude && loc.longitude;

		if(isLocationsFilled) {
			return loc;
		} else {
			return false;
		}
	},

	onAcqireLoc() {
		let loc = this.getLocFromUser();
		loc? this.flux.store('locations').updateLocation(loc): undefined;
	},

	onEmailVerify(token) {
		client.verify(token)
			.end(function(err, res){
				if(err){
					console.log(err);
				} else {
					if(res.status === 200) {
						let loggedUser = res.body;
						if (typeof loggedUser.username !== 'undefined') {
							this.state.users[loggedUser.username] = loggedUser;
							this.state.user = loggedUser.username;
							this.state.verifyResponse = 'SUCCESS';
							this.emit("change");
							this.emit("login");
						}
					} else {
						this.state.verifyResponse = res.body;
						this.emit("change");
					}
					
				}
			}.bind(this));
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
				} else {
					if(res.status !== 200) { // API error
						let apiErr = res.body;
						if(apiErr.email)
							this.state.loginFailed = apiErr.email;
						if(apiErr.password)
							this.state.loginFailed = apiErr.password;
						if(apiErr.error)
							this.state.loginFailed = apiErr.error;
						this.state.logingIn = false;
						this.emit("change");
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
						}
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

	augmentPatch(field, value) {
		let apiMap = {
			email: {email: value},
			username: {username: value},
			address: {
				location: {
					address:value
				}
			}
		};

		return apiMap[field];
	},


	onInfoSave(payload) {
		let field = payload.field;
		this.state.editors[field] = {};
		this.state.editors[field].loading = true;
		this.emit("change");

		let user = this.state.user;
		let patch = this.augmentPatch(field, payload.value);

		if (this.state.users[user]) {
			
			client.update(patch).end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					this.state.editors[field].loading = false;
					if(res.status !== 200) {
						if(res.body[field]) {
							let err = res.body[field][0];
							this.state.editors[field] = {loading: false,msg:err};
							this.state.loading = false;
							this.emit("change");
						}
					} else {
						var loggedUser = res.body;
						this.state.users[loggedUser.username] = loggedUser;
						this.state.user = loggedUser.username;
						this.state.editors[field] = {loading: false};
						this.state.loading = false;
						this.emit("change");
					}
					
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
		this.setFluxStatus(USER_LISTENING_CLICKED);

		client.listen(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else if(res.body.success) {
				// Refresh Listeners List
				this.onLoadUserListeners(payload);
				// optimistically change button condition till the real data loads
				this.state.users[username].is_listening = true;
				this.setFluxStatus(USER_BUTTON_LISTENED);
			}
		}.bind(this));
	},

	onStopListen(payload) {
		var username = payload.username;
		this.setFluxStatus(USER_LISTENING_CLICKED);

		client.stopListen(username)
			.end(function (err, res) {
				if (err) {
					console.log(err);
				} else if(res.body.success) {
					// Refresh Listeners List
					this.onLoadUserListeners(payload);
					// optimistically change button condition till the real data loads
					this.state.users[username].is_listening = false;
					this.setFluxStatus(USER_BUTTON_UNLISTENED);
				}
			}.bind(this));
	},

	onLoadUserListeners(payload) {
		var username = payload.username;

		client.getListeners(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				console.log(res.body);
				let next = this.parseNextPage(res.body.next);
				this.state.listens[username].listeners.list = res.body.results;
				this.state.listens[username].listeners.next = next;
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadMoreUserListeners(payload) {
		let username = payload.username;
		let current = this.state.listens[username].listeners.next;

		if (current) {
			client.getListeners(username, {page: current})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						let next = this.parseNextPage(res.body.next);
						let stock = this.state.listens[username].listeners.list;

						stock = [...stock, ...res.body.results];
						this.state.listens[username].listeners.list = stock;
						this.state.listens[username].listeners.next = next;

						this.state.loading = false;
						this.emit("change");
					}
				});

			this.state.loading = true;
			this.emit("change");
		}
		
	},

	onLoadUserListening(payload) {
		var username = payload.username;

		client.getListening(username).end((err, res) => {
			if (err) {
				console.log(err);
			} else {
				let next = this.parseNextPage(res.body.next);
				console.log(res.body.next);
				this.state.listens[username].listenings.list = res.body.users;
				this.state.listens[username].listenings.next = next;
				this.state.listens[username].tags.list = res.body.tags;
			}
			this.state.loading = false;
			this.emit("change");
		});

		this.state.loading = true;
		this.emit("change");
	},

	onLoadMoreUserListening(payload) {
		let username = payload.username;
		let current = this.state.listens[username].listenings.next;

		if(current) {
			client.getListening(username, {page: current})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						let next = this.parseNextPage(res.body.next);
						let stock = this.state.listens[username].listenings.list;

						stock = [...stock, ...res.body.users];
						this.state.listens[username].listenings.list = stock;
						this.state.listens[username].listenings.next = next;
						
						this.state.loading = false;
						this.emit("change");
					}
				});

			this.state.loading = true;
			this.emit("change");
		}
		
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
			loadedShouts.results.forEach(function(val) {
				userShouts.offers.push(val);
			}.bind(this));
			userShouts.maxOffers = Number(loadedShouts.count);
			userShouts.nextOffersPage = this.parseNextPage(loadedShouts.next);
		} else if (type === "request") {
			loadedShouts.results.forEach(function(val) {
				userShouts.requests.push(val);
			}.bind(this));
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
		this.state.listens[payload.username] = initUserListenEntry();
		this.onLoadUserListeners(payload);
		this.onLoadUserListening(payload);
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

	setFluxStatus(status) {
		this.state.status = status;
		this.emit("change");
		//clearing status to avoid displaying old messages
		setTimeout(() => {
			this.state.status = null;
			this.emit("change");
		},0);
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
