import React from "react";
import {Link} from "react-router";
import { connect } from "react-redux";

import DocumentTitle from "react-document-title";
import Dialog from "../shared/components/helper/Dialog.jsx";

import SocialLoginForm from "./SocialLoginForm";
import NativeLoginForm from "./NativeLoginForm";

import { createSession } from "../actions/session";

export const LoginDialog = React.createClass({
  displayName: "LoginDialog",

  componentWillReceiveProps(nextProps) {
    if (this.props.open && this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      // User has been logged in, redirect to home page
      this.props.history.replace("/home");
    }
  },

  render() {
    const { isLoggingIn, loginError } = this.props;
    const { open, onRequestClose, onSubmit } = this.props;
    return (
      <DocumentTitle title="Log in - Shoutit">
        <Dialog
          titleWithIcon="Log in"
          open={ open }
          onRequestClose={ onRequestClose }
          contentStyle={{ marginTop: -50 }}
          contentClassName="si-dialog">

          <div className="si-login">
            <div className="separator separator-with"></div>

            <SocialLoginForm />

            <div className="separator separator-or"></div>

              <NativeLoginForm
                error={ loginError }
                onSubmit={ onSubmit }
                loading={ isLoggingIn }
              />

            <div className="separator"></div>
            <center>
            <span style={{marginBottom: "5px"}}>
              New to Shoutit&#63;&nbsp;
              <Link to="/signup">
                <strong>Sign up</strong>
              </Link>
            </span>
            </center>
          </div>

          <Link to="/login/password" className="forgot-btn">
            Forgot your password?
          </Link>
        </Dialog>

      </DocumentTitle>
    );
  }

});

const mapStateToProps = state => {
  return {
    loggedUser: state.session.user,
    isLoggingIn: state.session.isLoggingIn,
    loginError: state.session.loginError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: loginData => dispatch(createSession(loginData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
