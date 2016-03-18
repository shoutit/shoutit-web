import React from "react";
import { StoreWatchMixin } from "fluxxor";

import DocumentTitle from "react-document-title";
import Progress from "../helper/Progress.jsx";
import Button from "../helper/Button.jsx";
export default React.createClass({

  displayName: "VerifyEmail",

  mixins: [new StoreWatchMixin("auth")],

  componentDidMount() {
    const { flux, location, loggedUser } = this.props;
    if (!loggedUser || !loggedUser.is_activated) {
      flux.actions.verifyEmail(location.query.token);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser
      && nextProps.loggedUser.is_activated) {
      // User has been logged in and it is activated: redirect to home page
      this.props.history.replace("/home");
    }
  },

  getStateFromFlux() {
    return this.props.flux.stores.auth.getState();
  },

  render() {
    const { isVerifyingEmail, emailVerificationError } = this.state;
    return (
      <DocumentTitle title="E-mail verification - Shoutit">
        <div>
          { isVerifyingEmail &&
            <div style={{ textAlign: "center" }}>
              <Progress />
              <p style={{ marginTop: 20 }}>Verifying your e-mail address…</p>
            </div>
           }
          { emailVerificationError && (
              emailVerificationError.message === `"Email address is already verified."` ?
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 20 }}>This e-mail address is already verified.</p>
                <Button primary to="/login" label="Login now" />
              </div> :
              <div style={{ textAlign: "center" }}>
                <p style={{ marginTop: 20 }}>Error verifying this e-mail address.</p>
                <p className="small" style={{ margin: 20}}>{ emailVerificationError.message }</p>
                <Button primary to="/login" label="Login now" />
              </div>
              )
          }
        </div>
      </DocumentTitle>
    );
  }
});
