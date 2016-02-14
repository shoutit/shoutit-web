import React from "react";

import LoginDialog from "../login/LoginDialog.jsx";
import SignupDialog from "../login/SignupDialog.jsx";

export default class ModalHost extends React.Component {

  render() {
    const { children, ...props } = this.props;
    const { location, history } = props;
    const state = location.state || {};

    const showLogin = state.modal === "login" || location.pathname === "/login";
    const showSignup = state.modal === "signup" || location.pathname === "/signup";

    return (
      <div>
        <LoginDialog
          {...props}
          open={ showLogin }
          onRequestClose={ () => history.pushState(null, location.pathname === "/login" ? "/" : location.pathname)}
        />
        <SignupDialog
          {...props}
          open={ showSignup }
          onRequestClose={ () => history.pushState(null, location.pathname === "/signup" ? "/" : location.pathname)}
        />
        { React.cloneElement(children, props) }
      </div>
    );
  }
}
