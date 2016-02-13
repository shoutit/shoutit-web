import React from 'react';

export default React.createClass({
  displayName: "SocialLogin",

  getInitialState() {
    return {
      running: false
    };
  },

  render() {
    return(
      <div>
        <span className="social-btn facebook" onClick={this.onFBLogin}>Log in with Facebook</span>
        <span className="social-btn google" onClick={this.onGPlusLogin}>Log in with Google+</span>
      </div>
    );
  },

  onGPlusLogin(e) {
    e.preventDefault();

    let This = this;
    let flux = this.props.flux;

    window.gapi.auth.signIn({
      clientid: "935842257865-s6069gqjq4bvpi4rcbjtdtn2kggrvi06.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      redirecturi: "postmessage",
      accesstype: "offline",
      requestvisibleactions: "http://schemas.google.com/AddActivity",
      scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email",
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

    let flux = this.props.flux;
    let loginFailed = this.props.loginFailed;

    let permReq = {
      scope: 'email'
    };

    window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        if(loginFailed === 'no_fb_email') { // It's a re-ask
          permReq['auth_type'] = 'rerequest';
          loginToFB();
        } else {
          checkEmailPermission(function(perm) {
            if(perm === 'granted'){
              flux.actions.login('fb', response.authResponse.accessToken);
            } else {
              flux.actions.loginErr('no_fb_email');
            }
          });
        }
      } else { // first time users
        loginToFB();
      }
    });

    function loginToFB() {
      window.FB.login(function (authResp) {
        if (authResp.authResponse) {
          checkEmailPermission(function(perm) {
            if(perm === 'granted'){
              flux.actions.login('fb', authResp.authResponse.accessToken);
            } else {
              flux.actions.loginErr('no_fb_email');
            }
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },permReq);
    }

    function checkEmailPermission(callback) {
      window.FB.api('/me/permissions', function(response) {
        response.data.forEach(function(perm) {
          if(perm.permission === 'email' && perm.status === 'granted') {
            callback(perm.status);
          } else if(perm.permission === 'email') {
            callback(perm.status);
          }
        });
      });
    }
  }
});
