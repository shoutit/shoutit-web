import React from "react";
import {Link} from "react-router";
import {StoreWatchMixin} from "fluxxor";
import DocumentTitle from "react-document-title";
import { Dialog } from "material-ui";

import SocialLoginForm from "../login/SocialLoginForm.jsx";
import RecoverPasswordForm from "../login/RecoverPasswordForm.jsx";
import NativeLoginFrom from "../login/NativeLoginFrom.jsx";

import { imagesPath } from "../../../../config";

export default React.createClass({
  displayName: "LoginDialog",
  mixins: [new StoreWatchMixin("users")],

  getInitialState() {
    return {
      showRecoverPassword: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.open && this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      this.props.history.replaceState(null, "/home");
    }
  },

  getStateFromFlux() {
    const flux = this.props.flux;
    const { loggingIn, loginFailed, forgetResult } = flux.store("users").getState();
    return { loggingIn, loginFailed, forgetResult };
  },

  render() {
    const { loggingIn, forgetResult, showRecoverPassword } = this.state;
    const { flux, open, onRequestClose } = this.props;

    return (
      <DocumentTitle title="Log in - Shoutit">
        <Dialog
          open={ open }
          onRequestClose={ onRequestClose }
          contentStyle={{ marginTop: -50 }}
          contentClassName="si-dialog">

          <div className="si-login">
            <div style={{ textAlign: "center"}}>
              <img src={ `${imagesPath}/mark.svg` } height={44} />
            </div>
            <h3>Log in</h3>
            <div className="separator separator-with"></div>

            <SocialLoginForm flux={flux} />

            <div className="separator separator-or"></div>

            {
              !showRecoverPassword ?
                <NativeLoginFrom
                  onSubmit={ data => flux.actions.login("shoutit", data) }
                  loading={loggingIn}
                /> :
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
