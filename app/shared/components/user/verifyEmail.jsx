import React from "react";
import { connect } from "react-redux";

import DocumentTitle from "react-document-title";
import Progress from "../helper/Progress.jsx";
import Button from "../helper/Button.jsx";

import { verifyEmail } from "../../../actions/session";

export const VerifyEmail = React.createClass({

  displayName: "VerifyEmail",

  componentDidMount() {
    const { location, dispatch } = this.props;
    dispatch(verifyEmail(location.query.token));
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser
      && nextProps.loggedUser.is_activated) {
      // User has been logged in and it is activated: redirect to home page
      this.props.history.replace("/home");
    }
  },

  render() {
    const { isVerifyingEmail, emailVerificationError } = this.props;
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
              emailVerificationError.error === `"Email address is already verified."` ?
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 20 }}>This e-mail address is already verified.</p>
                <Button primary to="/login" label="Login now" />
              </div> :
              <div style={{ textAlign: "center" }}>
                <p style={{ marginTop: 20 }}>Error verifying this e-mail address.</p>
                <p className="small" style={{ margin: 20}}>{ emailVerificationError.error }</p>
                <Button primary to="/login" label="Login now" />
              </div>
              )
          }
        </div>
      </DocumentTitle>
    );
  }
});

function mapStateToProps(state) {
  return {
    isVerifyingEmail: state.session.isVerifyingEmail,
    emailVerificationError: state.session.emailVerificationError
  };
}

export default connect(mapStateToProps)(VerifyEmail);
