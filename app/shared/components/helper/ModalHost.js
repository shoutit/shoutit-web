import React from "react";

import LoginDialog from "../../../auth/LoginDialog";
import SignupDialog from "../../../auth/SignupDialog";
import ResetPasswordDialog from "../../../auth/ResetPasswordDialog";

export default class ModalHost extends React.Component {

  static propTypes = {
    children: React.PropTypes.element
  };

  render() {

    const { children, ...props } = this.props;
    const { location, history } = props;
    const state = location.state || {};

    const showLogin = state.modal === "login" || location.pathname === "/login";
    const showPasswordRecovery = state.modal === "passwordRecovery" || location.pathname === "/login/password";
    const showSignup = state.modal === "signup" || location.pathname === "/signup";

    return (
      <div>
        <LoginDialog
          {...props}
          open={ showLogin }
          onRequestClose={ () => history.pushState(null, location.pathname === "/login" ? "/" : location.pathname) }
        />
        <ResetPasswordDialog
          {...props}
          open={ showPasswordRecovery }
          onRequestClose={ () => history.pushState(null, location.pathname === "/login/password" ? "/" : location.pathname) }
        />
        <SignupDialog
          {...props}
          open={ showSignup }
          onRequestClose={ () => history.pushState(null, location.pathname === "/signup" ? "/" : location.pathname) }
        />
        { children }
      </div>
    );
  }
}
