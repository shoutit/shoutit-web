import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';

import { createProfile, resetSessionErrors } from '../actions/session';

import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import SocialLoginForm from '../auth/SocialLoginForm';
import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

export class Signup extends Component {

  state = {
    success: false,
  };

  componentDidUpdate(prevProps) {
    const { signupError } = this.props;

    if (signupError && prevProps.signupError !== signupError) {
      let location;
      const errorLocations = getErrorLocations(signupError);
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
    dispatch(resetSessionErrors());
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const { isSigningUp, dispatch, currentLocation } = this.props;

    if (isSigningUp) {
      return;
    }

    const firstName = this.refs.firstName.getValue();
    const lastName = this.refs.lastName.getValue();
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();

    if (!firstName) {
      this.refs.firstName.focus();
      return;
    }
    if (!lastName) {
      this.refs.lastName.focus();
      return;
    }
    if (!email) {
      this.refs.email.focus();
      return;
    }
    if (!password) {
      this.refs.password.focus();
      return;
    }
    if (email && password) {
      this.refs.firstName.blur();
      this.refs.lastName.blur();
      this.refs.email.blur();
      this.refs.password.blur();
      dispatch(createProfile(
        { email, password, firstName, lastName, location: currentLocation }
      )).then(() => {
        this.setState({ success: true });
      });
    }
  }

  redirectToNextPage() {
    const { location: { query }, dispatch } = this.props;
    let afterUrl;
    if (query.after) {
      afterUrl = query.after;
    } else {
      afterUrl = '/';
    }
    dispatch(replace(afterUrl));
  }

  renderForm() {
    const { isSigningUp, location: { query }, signupError, dispatch, currentLocation } = this.props;
    return (
      <Frame title="Sign up">

        <div className="Frame-body">
          <div className="Frame-separator">
            <span>with</span>
          </div>
          <div className="Frame-form">
            <SocialLoginForm disabled={ isSigningUp } onLoginSuccess={ () => this.redirectToNextPage() } currentLocation={ currentLocation } />
          </div>
          <div className="Frame-separator">
            <span>or with your e-mail</span>
          </div>

          { signupError &&
            !getErrorsByLocation(signupError, 'email') &&
            !getErrorsByLocation(signupError, 'password') &&
            !getErrorsByLocation(signupError, 'first_name') &&
            !getErrorsByLocation(signupError, 'last_name') &&
            <p className="htmlErrorParagraph">
              Sign up did not work for an unknown error. Please try again later or contact support.
            </p>
        }

          <form onSubmit={ e => this.handleFormSubmit(e) } className="Frame-form" noValidate>

          <div className="Frame-form-horizontal-group">
            <TextField
              ref="firstName"
              autoComplete="off"
              block
              tooltipPlacement="left"
              disabled={ isSigningUp }
              name="first_name"
              type="text"
              errors={ signupError && getErrorsByLocation(signupError, 'first_name') }
              placeholder="First name"
              onBlur={ () => dispatch(resetSessionErrors()) }
              onChange={ () => dispatch(resetSessionErrors()) }
            />
            <TextField
              errors={ signupError && getErrorsByLocation(signupError, 'last_name') }
              ref="lastName"
              block
              disabled={ isSigningUp }
              name="last_name"
              type="text"
              placeholder="Last name"
              onBlur={ () => dispatch(resetSessionErrors()) }
              onChange={ () => dispatch(resetSessionErrors()) }
            />
          </div>

          <TextField
            ref="email"
            autoComplete="off"
            block
            disabled={ isSigningUp }
            name="email"
            type="email"
            errors={ signupError && getErrorsByLocation(signupError, 'email') }
            placeholder="E-mail address"
            onBlur={ () => dispatch(resetSessionErrors()) }
            onChange={ () => dispatch(resetSessionErrors()) }
          />

          <TextField
            errors={ signupError && getErrorsByLocation(signupError, 'password') }
            ref="password"
            block
            disabled={ isSigningUp }
            name="password"
            type="password"
            placeholder="Choose a password"
            onBlur={ () => dispatch(resetSessionErrors()) }
            onChange={ () => dispatch(resetSessionErrors()) }
          />

          <p style={{ paddingTop: '1rem', fontSize: '0.875rem' }}>
            By signing up, you agree to our Terms of Service and to our Privacy Policy.
          </p>

          <Button
            style={{ marginTop: '1rem' }}
            primary
            block
            disabled={ isSigningUp }
            label={ isSigningUp ? 'Creating account…' : 'Sign up' }
            />

          </form>
        </div>
        <div className="Frame-footer" style={{ textAlign: 'center' }}>
          Already have an account? { ' ' }
          <Link to={{ pathname: '/login', query }}>Log in</Link>
        </div>
      </Frame>
    );
  }

  renderSuccessMessage() {
    const { location: { query }, loggedUser } = this.props;
    return (
      <Frame title="Welcome to shoutit">
        <div className="Frame-body">
          <p>
            Hi { loggedUser.firstName }, thanks for signing up!
            <br /><br />
            Please verify your e-mail address by clicking on the link we just sent to { loggedUser.email }.
          </p>
        </div>
        <div className="Frame-footer" style={{ textAlign: 'center' }}>
          <Link to={{ pathname: '/', query }}>
            Go to your home page
          </Link>
        </div>
      </Frame>
    );
  }

  render() {
    const { success } = this.state;
    return (
      <Page title="Sign up">
        { !success ? this.renderForm() : this.renderSuccessMessage() }
      </Page>
    );
  }

}

const mapStateToProps = state => {
  return {
    loggedUser: state.session.user,
    isSigningUp: state.session.isSigningUp,
    signupError: state.session.signupError,
    currentLocation: state.currentLocation,
  };
};

export default connect(mapStateToProps)(Signup);
