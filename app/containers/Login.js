import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';
import { createSession } from '../actions/session';

import Page from '../layout/Page';

import SocialLoginForm from '../auth/SocialLoginForm';
import NativeLoginForm from '../auth/NativeLoginForm';


// if (process.env.BROWSER) {
//   require('./Interest.scss');
// }

// const fetchData = () => {};

export class Login extends Component {

  static propTypes = {
  };

  // static fetchData = fetchData;

  componentWillReceiveProps(nextProps) {
    const { loggedUser, onLoginSuccess } = this.props;
    if (loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      onLoginSuccess();
    }
  }

  render() {
    const { isLoggingIn, loginError, location } = this.props;
    const { onSubmit } = this.props;
    return (
      <Page className="Login" title="Login">
        {/* <div className="separator separator-with"></div>*/}
        <SocialLoginForm />
        {/* <div className="separator separator-or"></div>*/}

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
        {/* <center>
        <span style={{ marginBottom: '5px' }}>
          New to Shoutit&#63;&nbsp;
          <Link to="/signup">
            <strong>Sign up</strong>
          </Link>
        </span>
        </center>*/}
        <Link to="/login/password" className="forgot-btn">
          Forgot your password?
        </Link>
      </Page>
    );
  }

}

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
    afterUrl = '/';
  }
  return {
    onSubmit: loginData => dispatch(createSession(loginData)),
    onLoginSuccess: () => dispatch(replace(afterUrl)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
