import React from 'react';

import LoginDialog from '../../../auth/LoginDialog';
import SignupDialog from '../../../auth/SignupDialog';
import ResetPasswordDialog from '../../../auth/ResetPasswordDialog';

export default class ModalHost extends React.Component {

  static propTypes = {
    children: React.PropTypes.element,
  };

  render() {

    const { children, ...props } = this.props;
    const { location, history } = props;
    const state = location.state || {};

    const showLogin = state.modal === 'login' || location.pathname === '/login';
    const showPasswordRecovery = state.modal === 'passwordRecovery' || location.pathname === '/login/password';
    const showSignup = state.modal === 'signup' || location.pathname === '/signup';

    return (
      <div>
        { showLogin &&
          <LoginDialog
            {...props}
            open
            onRequestClose={ () => history.push(location.pathname === '/login' ? '/' : location.pathname) }
          />
        }
        { showPasswordRecovery &&
          <ResetPasswordDialog
            {...props}
            open={ showPasswordRecovery }
            onRequestClose={ () => history.push(location.pathname === '/login/password' ? '/' : location.pathname) }
          />
        }
        { showSignup &&
        <SignupDialog
          {...props}
          open={ showSignup }
          onRequestClose={ () => history.push(location.pathname === '/signup' ? '/' : location.pathname) }
        />
        }
        { React.cloneElement(children, props) }
      </div>
    );
  }
}
