import React from "react";
import {Link} from "react-router";
import {StoreWatchMixin} from "fluxxor";
import DocumentTitle from "react-document-title";
import Dialog from "../helper/Dialog.jsx";

import SocialLoginForm from "../login/SocialLoginForm.jsx";
import RecoverPasswordForm from "../login/RecoverPasswordForm.jsx";
import NativeLoginFrom from "../login/NativeLoginFrom.jsx";

export default React.createClass({
  displayName: "LoginDialog",
  mixins: [new StoreWatchMixin("auth")],

  getInitialState() {
    return {
      showRecoverPassword: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.open && this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      // User has been logged in, redirect to home page
      this.props.history.replaceState(null, "/home");
    }
    if (this.props.open && !nextProps.open) {
      // Dialog has been closed
      this.props.flux.actions.resetAuthErrors();
    }
  },

  getStateFromFlux() {
    const flux = this.props.flux;
    return flux.store("auth").getState();
  },

  render() {
    const { isLoggingIn, loginError, showRecoverPassword } = this.state;
    const { flux, open, onRequestClose } = this.props;
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

            <SocialLoginForm flux={flux} />

            <div className="separator separator-or"></div>

            {
              !showRecoverPassword ?
                <div>
                  <NativeLoginFrom
                    error={ loginError }
                    onSubmit={ ({ email, password}) =>
                      flux.actions.login({ email, password})
                    }
                    loading={ isLoggingIn }
                  />
                </div> :
              <RecoverPasswordForm flux={flux} res={forgetResult}/>

            }

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
          <span className="forgot-btn" onClick={() => this.setState({showRecoverPassword: true})}>
            Forgot your password?
          </span>
        </Dialog>

      </DocumentTitle>
    );
  }

});
