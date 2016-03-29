import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from '../ui/DocumentTitle';
import Dialog from '../shared/components/helper/Dialog.jsx';

import SocialLoginForm from './SocialLoginForm';
import NativeLoginForm from './NativeLoginForm';

import { createSession } from '../actions/session';

export const LoginDialog = React.createClass({
  displayName: 'LoginDialog',

  componentWillReceiveProps(nextProps) {
    const { open, loggedUser, onLoginSuccess } = this.props;
    if (open && loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      onLoginSuccess();
    }
  },

  render() {
    const { isLoggingIn, loginError, location } = this.props;
    const { open, onRequestClose, onSubmit } = this.props;
    return (
      <DocumentTitle title="Log in">
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

              { location.query && location.query.recover_sent &&
                <p>
                  A link to reset your password has been sent. Please check your e-mail.
                </p>
              }

              <NativeLoginForm
                error={ loginError }
                onSubmit={ onSubmit }
                loading={ isLoggingIn }
              />

            <div className="separator"></div>
            <center>
            <span style={{ marginBottom: '5px' }}>
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
  },

});

const mapStateToProps = state => {
  return {
    loggedUser: state.session.user,
    isLoggingIn: state.session.isLoggingIn,
    loginError: state.session.loginError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { location } = ownProps;

  let afterUrl;
  if (location.query.after) {
    afterUrl = location.query.after;
  } else {
    afterUrl = '/home';
  }
  return {
    onSubmit: loginData => dispatch(createSession(loginData)),
    onLoginSuccess: () => dispatch(replace(afterUrl)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
