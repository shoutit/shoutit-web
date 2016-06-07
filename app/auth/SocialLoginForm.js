/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import debug from 'debug';
import { FormattedMessage } from 'react-intl';

import { FacebookButton, GoogleButton } from '../ui/SocialButtons';
import { loginWithGoogle, loginWithFacebook } from '../actions/session';

const logFacebook = debug('shoutit:facebook');

export class SocialLoginForm extends Component {

  static propTypes = {
    currentLocation: PropTypes.object,  // passing this, will send the current location to the login actions
    onLoginSuccess: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    error: null,
    waitingForFacebook: false,
    waitingForGoogle: false,
  };

  handleGoogleLoginClick(e) {
    e.preventDefault();

    const { dispatch, onLoginSuccess, currentLocation } = this.props;

    this.setState({ error: null, waitingForGoogle: true });

    window.gapi.auth.signIn({
      clientid: '935842257865-s6069gqjq4bvpi4rcbjtdtn2kggrvi06.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      redirecturi: 'postmessage',
      accesstype: 'offline',
      requestvisibleactions: 'http://schemas.google.com/AddActivity',
      scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
      callback: authResult => {
        if (!authResult.status.signed_in) {
          this.setState({ waitingForGoogle: false });
          return;
        }
        dispatch(loginWithGoogle(
          { gplus_code: authResult.code },
          { location: currentLocation }
        )).then(() => onLoginSuccess());
      },
    });
  }

  handleFacebookLoginClick() {
    const { error } = this.state;
    const { dispatch, onLoginSuccess, currentLocation } = this.props;

    const options = { scope: 'email', return_scopes: true };

    if (error === 'NO_FACEBOOK_EMAIL_PERMISSION') {
      options.auth_type = 'rerequest';
    }

    this.setState({ error: null, waitingForFacebook: true });

    window.FB.login(facebookResponse => {
      const { authResponse } = facebookResponse;

      logFacebook('Login response', facebookResponse);

      if (!authResponse) {
        this.setState({ waitingForFacebook: false });
        return;
      }
      if (authResponse.grantedScopes.split(',').indexOf('email') === -1) {
        logFacebook('Missing permission scope');
        this.setState({ error: 'NO_FACEBOOK_EMAIL_PERMISSION', waitingForFacebook: false });
        return;
      }
      dispatch(loginWithFacebook(
        { facebook_access_token: authResponse.accessToken },
        { location: currentLocation }
      )).then(() => onLoginSuccess());
    }, options);
  }

  render() {
    const { disabled } = this.props;
    const { error } = this.state;
    return (
      <div className="SocialLoginForm">
        { error === 'NO_FACEBOOK_EMAIL_PERMISSION' &&
          <p className="htmlErrorParagraph">
            <FormattedMessage
              id="socialLogin.facebook.emailPermission"
              defaultMessage="In order to use your Facebook account, you should allow us access to your e-mail address. Please try again to request the permission to use your e-mail address."
            />
          </p>
        }
        <FacebookButton
          disabled={ disabled }
          style={ { marginBottom: '.5rem' } }
          block
          onClick={ e => this.handleFacebookLoginClick(e) }>
          <FormattedMessage
            id="socialLogin.facebook.buttonLabel"
            defaultMessage="Facebook"
          />
        </FacebookButton>
        <GoogleButton
          disabled={ disabled }
          block
          onClick={ e => this.handleGoogleLoginClick(e) }>
          <FormattedMessage
            id="socialLogin.google.buttonLabel"
            defaultMessage="Google+"
          />
        </GoogleButton>
      </div>
    );
  }

}

export default connect()(SocialLoginForm);
