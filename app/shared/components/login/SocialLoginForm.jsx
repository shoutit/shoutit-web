/* eslint-env browser */

import React, { Component } from "react";
import debug from "debug";

import { FacebookButton, GoogleButton } from "../helper/SocialButtons.jsx";

const logFacebook = debug("shoutit:facebook");

export default class SocialLoginForm extends Component {

  static propTypes = {
    flux: React.PropTypes.object.isRequired
  };

  state = {
    error: null,
    waitingForFacebook: false,
    waitingForGoogle: false
  };

  handleGoogleLoginClick(e) {
    e.preventDefault();

    const flux = this.props.flux;
    this.setState({ error: null, waitingForGoogle: true });

    window.gapi.auth.signIn({
      clientid: "935842257865-s6069gqjq4bvpi4rcbjtdtn2kggrvi06.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      redirecturi: "postmessage",
      accesstype: "offline",
      requestvisibleactions: "http://schemas.google.com/AddActivity",
      scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email",
      callback: authResult => {
        if (!authResult.status.signed_in) {
          this.setState({ waitingForGoogle: false });
          return;
        }
        flux.actions.login("gplus", authResult.code);
      }
    });
  }

  handleFacebookLoginClick() {
    const { flux } = this.props;
    const { error } = this.state;

    const options = { scope: "email", return_scopes: true };

    if (error === "NO_FACEBOOK_EMAIL_PERMISSION") {
      options.auth_type = "rerequest";
    }

    this.setState({ error: null, waitingForFacebook: true });

    window.FB.login(facebookResponse => {
      const { authResponse } = facebookResponse;

      logFacebook("Login response", facebookResponse);

      if (authResponse.grantedScopes.split(",").indexOf("email") === -1 ) {
        logFacebook("Missing permission scope");
        this.setState({ error: "NO_FACEBOOK_EMAIL_PERMISSION", waitingForFacebook: false});
        return;
      }

      flux.actions.login("fb", authResponse.accessToken);

    }, options);
  }

  render() {
    const { error, waitingForGoogle, waitingForFacebook } = this.state;
    return(
      <div>
        { error === "NO_FACEBOOK_EMAIL_PERMISSION" &&
          <p style={{ color: "red !important", fontSize: 13 }}>
            In order to use your Facebook account, you should allow us access to your e-mail address.<br/>
            Please try again to request the permission to use your e-mail address.
          </p>
        }
        <FacebookButton
          block
          label={ waitingForFacebook ? "Waiting for Facebook…" : "Facebook" }
          onClick={ e => this.handleFacebookLoginClick(e) }
        />
        <GoogleButton
          block
          label={ waitingForGoogle ? "Waiting for Google…" : "Google+" }
          onClick={ e => this.handleGoogleLoginClick(e) }
        />
      </div>
    );
  }

}
