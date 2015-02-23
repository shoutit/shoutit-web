/** @jsx React.DOM */

var React = require('react'),
	FluxMixin = require('fluxxor').FluxMixin(React);
Clear = require('./helper/clear.jsx');

module.exports = Login = React.createClass({
	mixins: [FluxMixin],

	getInitialState: function () {
		return {
			running: false
		}
	},

	render: function () {
		return (
			<div className="login">
				<div className="login-container">
					<div className="top-login">
						<img src="img/logo2.png"/>
						<h4>What will you shout today</h4>
					</div>
					<Clear />
					<input type="text" placeholder="Email" className="email"/>
					<input type="text" placeholder="Password" className="pass"/>
					<button className="btn btn-sign btn-submit submit" type="button">
						Sign In
					</button>
					<Clear />
					<div className="login-inl">
						<div className="stay">
							<input type="radio" id="stay"/>
							<label htmlFor="stay">Stay Signed in</label>
						</div>
						<div className="login-help">
							<p>Help</p>
						</div>
					</div>
					<button className="btn btn-fb submit" type="button" onClick={this.onFBLogin}>Connect with Facebook</button>
					<button className="btn btn-google submit" type="button" onClick={this.onGPlusLogin}>Connect with Google+</button>
					<p className="login-bot">Don't have an account&#63;
						<span>Sign Up</span>
					</p>
				</div>
				<script src="//apis.google.com/js/client:platform.js"></script>
				<script src="//connect.facebook.net/en_US/sdk.js"></script>
			</div>
		);
	},

	componentDidMount: function () {
		FB.init({
			appId: "353625811317277",
			version: 'v2.0'
		});
	},

	onGPlusLogin: function (e) {
		e.preventDefault();

		var This = this;
		var flux = this.getFlux();

		gapi.auth.signIn({
			clientid: "935842257865-s6069gqjq4bvpi4rcbjtdtn2kggrvi06.apps.googleusercontent.com",
			cookiepolicy: "single_host_origin",
			redirecturi: "postmessage",
			accesstype: "offline",
			requestvisibleactions: "http://schemas.google.com/AddActivity",
			scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload",
			callback: function (authResult) {
				if (authResult['status']['signed_in']) {
					if (!This.state.running) {
						This.setState({running: true});
						flux.actions.login('gplus', authResult.code);
					}
				}
			}
		});
	},


	onFBLogin: function (e) {
		e.preventDefault();

		var flux = this.getFlux();

		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {
				flux.actions.login('fb', response.authResponse.accessToken);
			} else {
				FB.login(function (authResp) {
					if (authResp.authResponse) {
						flux.actions.login('fb', authResp.authResponse.accessToken);
					} else {
						console.log('User cancelled login or did not fully authorize.');
					}
				});
			}
		});
	}
});