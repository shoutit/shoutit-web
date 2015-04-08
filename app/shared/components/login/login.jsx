var React = require('react'),
	FluxMixin = require('fluxxor').FluxMixin(React),
	Clear = require('./../helper/clear.jsx'),
	Input = require('react-bootstrap/Input'),
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Icon = require('../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "Login",
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
					<Input type="text" placeholder="Email" addonBefore={<Icon name="email"/>} className="email"/>
					<Input type="text" placeholder="Password" addonBefore={<Icon name="pass"/>} className="pass"/>
					<button className="btn btn-sign btn-submit submit" type="button">
						Sign In
					</button>
					<Clear />
					<Container fluid={true} className="login-inline">
						<Col xs={6} md={6} className="login-stay">
							<Input type="radio" label="Stay Signed in"/>
						</Col>
						<Col xs={6} md={6} className="login-help">
							<Icon name="help"/>
							Help
						</Col>
					</Container>
					<button className="btn btn-fb submit" type="button" onClick={this.onFBLogin}>
						<Icon name="fb"/>
						Connect with Facebook
					</button>
					<button className="btn btn-google submit" type="button" onClick={this.onGPlusLogin}>
						<Icon name="google"/>
						Connect with Google+
					</button>
					<p className="login-bot">Don't have an account&#63;
						<span>Sign Up</span>
					</p>
				</div>
			</div>
		);
	},

	onGPlusLogin: function (e) {
		e.preventDefault();

		var This = this;
		var flux = this.getFlux();

		window.gapi.auth.signIn({
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

		window.FB.getLoginStatus(function (response) {
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