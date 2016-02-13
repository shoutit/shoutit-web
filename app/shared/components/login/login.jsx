import React from 'react';
import {History, Link} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import NativeLogin from './nativeLogin.jsx';
import SocialLogin from './socialLogin.jsx';
import ForgetPass from './forgetPass.jsx';
import {Dialog} from 'material-ui';

export default React.createClass({
  displayName: "Login",
  mixins: [new StoreWatchMixin('users'), History],

  getInitialState() {
    return {
      forgetPass: false
    }
  },

  getStateFromFlux() {
    let flux = this.props.flux;
    let store = flux.store('users').getState();

    return {
      logingIn: store.logingIn,
      loginFailed: store.loginFailed,
      forgetResult: store.forgetResult,
      user: store.user
    };
  },

  render() {
    return (
      <DocumentTitle title="Log in - Shoutit">
        <Dialog open={true} onRequestClose={this.onDismiss} contentStyle={{marginTop:'-50px'}}
                contentClassName="si-dialog">
          <div className="si-login">
            <div className="icon res1x-sign_logo"></div>
            <h3>Log in</h3>
            <SocialLogin flux={this.props.flux} loginFailed={this.state.loginFailed}/>
            <div className="separator separator-or"></div>

            <p>{this.renderLoginError()}</p>
            {this.renderNativeLogin()}
            {this.renderForgetPass()}

            <div className="separator"></div>
            <center>
            <span style={{marginBottom: '5px'}}>
              New to Shoutit&#63;&nbsp;
              <Link to="/signup">Sign up</Link>
            </span>
            </center>
          </div>
          <span className="forgot-btn" onClick={() => this.setState({forgetPass: true})}>
            Forgot your password?
          </span>
        </Dialog>

      </DocumentTitle>
    );
  },

  componentDidMount() {
    this.checkLogin();
  },

  componentDidUpdate() {
    this.checkLogin();
  },

  checkLogin() {
    if (this.state.user) {
      this.history.replaceState(null, 'home');
    }
  },

  onDismiss() {
    setTimeout(() => this.history.goBack(), 300);
  },

  renderLoginError() {
    if (this.state.loginFailed === 'no_fb_email') {
      return (
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
    return this.state.loginFailed !== 'no_fb_email' && !this.state.forgetPass ?
      <NativeLogin flux={this.props.flux} logingIn={this.state.logingIn}/> : null;
  },

  renderForgetPass() {
    return this.state.forgetPass ?
      <ForgetPass flux={this.props.flux} res={this.state.forgetResult}/> : null;
  }
});
