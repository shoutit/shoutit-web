import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';

import { createSession, resetSessionErrors } from '../actions/session';

import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import SocialLoginForm from '../auth/SocialLoginForm';
import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

export class Login extends Component {

  static propTypes = {
  };

  state = {
    email: '',
    password: '',
  };

  // static fetchData = fetchData;

  componentWillReceiveProps(nextProps) {
    const { loggedUser, onLoginSuccess } = this.props;
    if (loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      onLoginSuccess();
    }
  }

  componentDidUpdate(prevProps) {
    const { loginError } = this.props;

    if (loginError && prevProps.loginError !== loginError) {
      let location;
      const errorLocations = getErrorLocations(loginError);
      if (errorLocations.includes('email')) {
        location = 'email';
      } else if (errorLocations.includes('password')) {
        location = 'password';
      }
      if (location && this.refs[location].getValue()) {
        this.refs[location].select();
      } else if (location) {
        this.refs[location].focus();
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetSessionErrors());
  }

  handleFormSubmit(e) {
    const { isLoggingIn, onSubmit } = this.props;

    e.preventDefault();

    if (isLoggingIn) {
      return;
    }

    const form = e.target;
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();

    if (!email) {
      form.email.focus();
      return;
    }
    if (!password) {
      form.password.focus();
      return;
    }
    if (email && password) {
      form.email.blur();
      form.password.blur();
      onSubmit({ email, password });
    }
  }


  render() {
    const { isLoggingIn, location: { query }, loginError } = this.props;

    return (
      <Page className="Login" title="Log in">

        <Frame title="Login">

          <div className="Frame-body">
            <div className="Frame-separator">
              <span>with</span>
            </div>
            <div className="Frame-form">
              <SocialLoginForm disabled={ isLoggingIn } />
              { query && query.recover_sent &&
                <p>
                  A link to reset your password has been sent. Please check your e-mail.
                </p>
              }
            </div>
            <div className="Frame-separator">
              <span>or</span>
            </div>

            { loginError &&
              !getErrorsByLocation(loginError, 'email') &&
              !getErrorsByLocation(loginError, 'password') &&
              <p className="htmlErrorParagraph">
                Login did not work for an unknown error. Please try again later or contact support.
              </p>
          }

            <form onSubmit={ e => this.handleFormSubmit(e) } className="Frame-form" noValidate>
              <TextField
                ref="email"
                autoComplete="off"
                block
                disabled={ isLoggingIn }
                name="email"
                type="email"
                errors={ loginError && getErrorsByLocation(loginError, 'email') }
                placeholder="E-mail or username"
                onChange={ email => {
                  this.props.dispatch(resetSessionErrors());
                  this.setState({ email });
                }}
              />
              <TextField
                errors={ loginError && getErrorsByLocation(loginError, 'password') }
                ref="password"
                block
                disabled={ isLoggingIn }
                name="password"
                type="password"
                placeholder="Password"
                onChange={ password => {
                  this.props.dispatch(resetSessionErrors());
                  this.setState({ password });
                }}
              />

              <Button
                style={{ marginTop: '1rem' }}
                primary
                block
                disabled={ isLoggingIn }
                label={ isLoggingIn ? 'Logging in…' : 'Log in' }
                />

              <div className="Frame-form-horizontal-group">
                <span>
                  <input disabled={ isLoggingIn } type="checkbox" defaultChecked id="login-keep-session" />
                  <label htmlFor="login-keep-session"> Keep me logged in</label>
                </span>
                <span>
                  <Link to={{ pathname: '/login/password', query }} className="forgot-btn">
                    Recover your password
                  </Link>
                </span>
              </div>

            </form>
          </div>
          <div className="Frame-footer" style={{ textAlign: 'center' }}>
            New to shoutit? { ' ' }
            <Link to={{ pathname: '/signup', query }}>Sign up</Link>
          </div>
        </Frame>
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
