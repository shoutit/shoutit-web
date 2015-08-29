import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import Clear from './../helper/clear.jsx';
import Icon from '../helper/icon.jsx';
import DocumentTitle from 'react-document-title';
import {Modal,Input,Glyphicon,Button,Alert} from 'react-bootstrap';

export default React.createClass({
	displayName: "Login",
	mixins: [new FluxMixin(React), new StoreWatchMixin('users')],

	getInitialState() {
		return {
			running: false
		};
	},

	getStateFromFlux() {
		let flux = this.getFlux();
		let store = flux.store('users').getState();

		return {
			logingIn: store.logingIn,
			loginFailed: store.loginFailed
		};
	},

	render() {

		return (
		<div className="login">
			<div className="login-container">
				<div className="top-login">
					<img src="img/logo2.png"/>
					<h4>What will you shout today</h4>
					<Alert bsStyle="warning" >{this.state.loginFailed? 'The username or password is incorrect!':''}</Alert>


				</div>
				<form onSubmit={this.onLoginSubmit}>
					<Input ref='email' type='text' placeholder='Email' className='input-email' />
					<Input ref='pass' type='password' placeholder='Password' className='input-pass' />
					<Button bsSize='large' type='submit' block 
					className={this.state.logingIn? 'btn-signin btn-signin-disabled':'btn-signin'}>
					{this.state.logingIn? 'Signing In...': 'Sign In'}</Button>
					<Input type='checkbox' label='Stay Signed In' />
				</form>

				<Clear />
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


	onLoginSubmit(e) {
		e.preventDefault();
		let flux = this.getFlux();

		let email = React.findDOMNode(this.refs.email).children[0].value;
		let pass = React.findDOMNode(this.refs.pass).children[0].value;

		if(email && pass)
			flux.actions.login('shoutit',{email:email,pass:pass});
	},

	onGPlusLogin(e) {
		e.preventDefault();

		let This = this;
		let flux = this.getFlux();

		window.gapi.auth.signIn({
			clientid: "935842257865-s6069gqjq4bvpi4rcbjtdtn2kggrvi06.apps.googleusercontent.com",
			cookiepolicy: "single_host_origin",
			redirecturi: "postmessage",
			accesstype: "offline",
			requestvisibleactions: "http://schemas.google.com/AddActivity",
			scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload",
			callback(authResult) {
				if (authResult.status.signed_in) {
					if (!This.state.running) {
						This.setState({running: true});
						flux.actions.login('gplus', authResult.code);
					}
				}
			}
		});
	},


	onFBLogin(e) {
		e.preventDefault();

		let flux = this.getFlux();

		window.FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {
				flux.actions.login('fb', response.authResponse.accessToken);
			} else {
				window.FB.login(function (authResp) {
					if (authResp.authResponse) {
						flux.actions.login('fb', authResp.authResponse.accessToken);
					} else {
						console.log('User cancelled login or did not fully authorize.');
					}
				}, {
					scope: 'email'
				});
			}
		});
	}
});
