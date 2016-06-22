/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as FacebookUtils from '../utils/FacebookUtils';

import { FacebookButton, GoogleButton } from '../ui/SocialButtons';
import { loginWithGoogle, loginWithFacebook } from '../actions/session';

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

    const options = {};
    if (error === 'FACEBOOK_INVALID_SCOPE') {
      options.auth_type = 'rerequest';
    }

    this.setState({ error: null, waitingForFacebook: true });

    FacebookUtils.login(options, (error, response) => {
      if (error) {
        this.setState({
          waitingForFacebook: false,
          error,
        });
        return;
      }
      dispatch(loginWithFacebook(
          { facebook_access_token: response.authResponse.accessToken },
          { location: currentLocation }
        )).then(() => onLoginSuccess());
    });

  }

  render() {
    const { disabled } = this.props;
    const { error } = this.state;
    return (
      <div className="SocialLoginForm">
        { error === 'FACEBOOK_INVALID_SCOPE' &&
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
