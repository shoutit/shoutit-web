import React from 'react';
import { Link } from 'react-router';
import { Input } from 'react-bootstrap';

import { connect } from 'react-redux';

import DocumentTitle from '../ui/DocumentTitle';
import Dialog from '../shared/components/helper/Dialog.jsx';
import Button from '../shared/components/helper/Button.jsx';
import SocialLoginForm from './SocialLoginForm';

import { createProfile } from '../actions/session';

export const SignupDialog = React.createClass({

  displayName: 'SignupDialog',

  componentWillReceiveProps(nextProps) {
    if (this.props.open && this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      if (nextProps.loggedUser.is_activated) {
        this.props.history.replace('/home');
      }
    }
  },

  handleFormSubmit(e) {
    e.preventDefault();

    if (this.props.isSigningUp) {
      return;
    }

    const firstName = this.refs.firstName.getValue();
    const lastName = this.refs.lastName.getValue();
    const password = this.refs.password.getValue();
    const email = this.refs.email.getValue();

    if (!firstName || !lastName || !email || !password) {
      return;
    }

    this.refs.firstName.getInputDOMNode().blur();
    this.refs.lastName.getInputDOMNode().blur();
    this.refs.email.getInputDOMNode().blur();
    this.refs.password.getInputDOMNode().blur();

    this.props.onSubmit({
      email,
      name: `${firstName} ${lastName}`,
      password
    });

  },

  renderForm() {
    const { isSigningUp, signupError } = this.props;
    const error = signupError || {};
    return (
      <div className="si-signup">
        <div className="separator separator-with"></div>

        <SocialLoginForm />

        <div className="separator separator-or"></div>

        <form onSubmit={ this.handleFormSubmit } noValidate>

          { error.first_name && <p className="small">{ error.first_name }</p> }

          <Input
            ref="firstName"
            type="text"
            placeholder="First Name"
            className={ `input-name ${error.first_name ? 'input-alert' : ''}` }
          />

          { error.last_name && <p className="small">{ error.last_name }</p> }

          <Input
            ref="lastName"
            type="text"
            placeholder="Last Name"
            className={ `input-name input-last-name ${error.last_name ? 'input-alert' : ''}` }
          />

          { error.email && <p className="small">{ error.email }</p> }

          <Input
            ref="email"
            type="email"
            placeholder="E-mail"
            className={`input-email ${error.email ? 'input-alert' : ''}`}
          />

          { error.password && <p className="small">{ error.password }</p> }

          <Input
            ref="password"
            type="password"
            placeholder="Password"
            className={`input-password ${error.password ? 'input-alert' : ''}`}
          />

          <Button
            type="submit"
            primary
            block
            disabled={ isSigningUp }
            label={ isSigningUp ? 'Signing up…' : 'Sign up' } />

          <p className="signup-note">
            By signing up, you agree to the<br />Terms of Service and the Privacy Policy
          </p>
        </form>
        <div className="separator"></div>
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          Have an account? <Link to="/login"><strong>Log in</strong></Link>
        </div>
      </div>
    );
  },

  renderSuccessMessage() {
    const { loggedUser } = this.props;
    return (
      <div className="si-signup">
        <div className="separator"></div>
        <p style={{ marginTop:'25px' }}>
          Dear { loggedUser.first_name }, welcome to Shoutit.
          We are happy to have you here!
        </p>
        <p className="small">
          To use Shoutit with full potential, please verify your e-mail address
          by clicking on the link we have sent to your email <span>{ loggedUser.email }</span>.
        </p>
        <center>
          <div style={{ margin: '30px' }}>
            <Button
              primary
              block
              to="/home"
              label="Go to your home page" />
          </div>
        </center>
      </div>
    );
  },

  render() {
    const { open, onRequestClose, loggedUser } = this.props;
    const waitingForVerification = loggedUser && !loggedUser.is_activated;
    return (
      <DocumentTitle title="Sign up">
        <Dialog
          titleWithIcon={ waitingForVerification ? 'You are done!' : 'Sign up' }
          open={ open }
          onRequestClose={ onRequestClose }
          contentStyle={{ marginTop: -50 }}
          contentClassName="si-dialog">

          { waitingForVerification ?
            this.renderSuccessMessage() :
            this.renderForm()
          }

        </Dialog>
      </DocumentTitle>
    );
  }

});


const mapStateToProps = state => {
  return {
    loggedUser: state.session.user,
    isSigningUp: state.session.isSigningUp,
    signupError: state.session.signupError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: loginData => dispatch(createProfile(loginData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupDialog);
