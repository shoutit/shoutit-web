import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';
import Helmet from '../utils/Helmet';

import { login, resetErrors } from '../actions/session';

import Button from '../ui/Button';
import HorizontalRule from '../ui/HorizontalRule';
import TextField from '../ui/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import SocialLoginForm from '../auth/SocialLoginForm';
import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';
import { getLoggedUser } from '../selectors';

if (process.env.BROWSER) {
  require('./Login.scss');
}

export class Login extends Component {

  static propTypes = {
    error: PropTypes.object,
    isLoggingIn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (error && prevProps.error !== error) {
      let location;
      const errorLocations = getErrorLocations(error);
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
    const { dispatch } = this.props;
    dispatch(resetErrors());
  }

  submit(e) {
    e.preventDefault();

    const { isLoggingIn, dispatch } = this.props;

    if (isLoggingIn) {
      return;
    }

    const form = e.target;
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    // const keepSession = this.refs.keep_session.checked;

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
      dispatch(login({ email, password })).then(() => {
        this.redirectToNextPage();
      });
    }
  }

  redirectToNextPage() {
    const { location: { query }, dispatch } = this.props;
    let redirectUrl;
    if (query.redirect) {
      redirectUrl = query.redirect;
    } else {
      redirectUrl = '/';
    }
    dispatch(replace(redirectUrl));
  }

  render() {
    const { isLoggingIn, location: { query }, error } = this.props;
    return (
      <Page className="Login">
        <Helmet title="Login" />
        <Frame title={ query.login_action ? 'Please login to continue' : 'Login' }>

          <div className="Frame-body">

            <HorizontalRule label="with" />

            <div className="Frame-form">
              <SocialLoginForm disabled={ isLoggingIn } onLoginSuccess={ () => this.redirectToNextPage() } />
            </div>

            <HorizontalRule label="or" />

            { error &&
              !getErrorsByLocation(error, 'email') &&
              !getErrorsByLocation(error, 'password') &&
              <p className="htmlErrorParagraph">
                Login did not work for an unknown error. Please try again later or contact support.
              </p>
          }

            <form onSubmit={ this.submit } className="Form Frame-form" noValidate>
              <TextField
                ref="email"
                disabled={ isLoggingIn }
                name="email"
                type="text"
                error={ error }
                placeholder="E-mail or username"
              />
              <TextField
                error={ error }
                ref="password"
                disabled={ isLoggingIn }
                name="password"
                type="password"
                placeholder="Password"
              />

              <Button
                style={ { marginTop: '1rem' } }
                action="primary"
                block
                disabled={ isLoggingIn }>
                { isLoggingIn ? 'Logging in…' : 'Log in' }
              </Button>

              <div className="Frame-form-horizontal-group" style={ { fontSize: '0.875rem' } }>
                {/* <span>
                  <input ref="keep_session" name="keep_session" disabled={ isLoggingIn } type="checkbox" defaultChecked id="login-keep-session" />
                  <label htmlFor="login-keep-session"> Keep me logged in</label>
                </span>*/}
                <span>
                  <Link to={ { pathname: '/login/password', query } } className="forgot-btn">
                    Recover your password
                  </Link>
                </span>
              </div>

            </form>
          </div>
          <div className="Frame-footer" style={ { textAlign: 'center' } }>
            New to shoutit? { ' ' }
            <Link to={ { pathname: '/signup', query } }>Sign up</Link>
          </div>
        </Frame>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedUser: getLoggedUser(state),
    isLoggingIn: state.session.isLoggingIn,
    error: state.session.loginError,
  };
};

export default connect(mapStateToProps)(Login);
