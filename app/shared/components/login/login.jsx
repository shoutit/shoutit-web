import React from 'react';
import {Navigation,Link} from 'react-router';
import {Alert} from 'react-bootstrap';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import DocumentTitle from 'react-document-title';
import NativeLogin from './nativeLogin.jsx';
import SocialLogin from './socialLogin.jsx';
import ForgetPass from './forgetPass.jsx';

export default React.createClass({
	displayName: "Login",
	mixins: [new FluxMixin(React), new StoreWatchMixin('users'), Navigation],

	getInitialState() {
		return {
			forgetPass: false
		}
	},

	getStateFromFlux() {
		let flux = this.getFlux();
		let store = flux.store('users').getState();

		return {
			logingIn: store.logingIn,
			loginFailed: store.loginFailed,
			forgetResult: store.forgetResult
		};
	},

	render() {
		return (
			<DocumentTitle title="Login - Shoutit">
				<div className="login">
					<div className="login-container">
						<div className="top-login">
							<Link to="app"><img src="img/logo2.png"/></Link>
							<h4>What will you shout today</h4>
						</div>

						<p>{this.renderLoginError()}</p>
						{this.renderNativeLogin()}
						{this.renderForgetPass()}
						<SocialLogin flux={this.getFlux()} loginFailed={this.state.loginFailed} />
						
						<p style={{fontSize:'17px',marginTop: '20px'}}>
							Don't have an account&#63;&nbsp;
							<Link to="signup">Signup</Link>
						</p>
						<span className="forget-btn" onClick={() => this.setState({forgetPass: true})}>
							forget your password?
						</span>
					</div>
				</div>
			</DocumentTitle>	
		);
	},

	renderLoginError() {
		if(this.state.loginFailed === 'no_fb_email') {
			return(
				<div>
					<p>In order to enter Shoutit using your Facebook account you
			 		need to allow us access to your email permission. Please try again
			 		or use other sign-in methods.</p>
			 		<span className="forget-btn" onClick={() => this.setState({loginFailed: ''})}>
						Go back to Login page
					</span>
				</div>);
		} else {
			return this.state.loginFailed;
		}
	},

	renderNativeLogin() {
		return this.state.loginFailed !== 'no_fb_email' && !this.state.forgetPass?
			<NativeLogin flux={this.getFlux()} logingIn={this.state.logingIn}/>: null;
	},

	renderForgetPass() {
		return this.state.forgetPass?
			<ForgetPass flux={this.getFlux()} res={this.state.forgetResult} />: null;
	}
});