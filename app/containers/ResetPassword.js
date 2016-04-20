import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from '../utils/Helmet';

import { resetPassword } from '../actions/session';

import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

export class ResetPassword extends Component {

  static propTypes = {
    error: PropTypes.object,
    isResettingPassword: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  state = {
    sent: false,
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (error && prevProps.error !== error) {
      let location;
      const errorLocations = getErrorLocations(error);
      if (errorLocations.includes('email')) {
        location = 'email';
      }

      if (location && this.refs[location].getValue()) {
        this.refs[location].select();
      } else if (location) {
        this.refs[location].focus();
      }
    }
  }

  handleFormSubmit(e) {
    const { isResettingPassword, dispatch } = this.props;
    e.preventDefault();
    const email = this.refs.email.getValue();
    if (isResettingPassword) {
      return;
    }
    if (!email) {
      this.refs.email.focus();
      return;
    }
    this.refs.email.blur();
    dispatch(resetPassword(email)).then(() => this.setState({ sent: true }));
  }

  renderForm() {
    const { isResettingPassword, location: { query }, error } = this.props;
    return (
      <Frame title="Reset your password">

        <div className="Frame-body">

          { error && !getErrorsByLocation(error, 'email') &&
            <p className="htmlErrorParagraph">
              Could not reset your password because of an unknown error. Please try again later or contact support.
            </p>
        }

          <form onSubmit={ e => this.handleFormSubmit(e) } className="Frame-form" noValidate>
            <TextField
              autoFocus
              ref="email"
              block
              disabled={ isResettingPassword }
              name="email"
              type="email"
              error={ error }
              placeholder="Enter your e-mail or username"
              onChange={ email => this.setState({ email }) }
            />

            <Button
              style={{ marginTop: '1rem' }}
              primary
              block
              disabled={ isResettingPassword }
              label={ isResettingPassword ? 'Please wait…' : 'Send link' }
              />

            <p className="htmlAncillary">
              You will receive a link to change the password.
            </p>

          </form>
        </div>
        <div className="Frame-footer" style={{ textAlign: 'center' }}>
          <Link to={{ pathname: '/login', query }}>Back to login</Link>
        </div>
      </Frame>
    );
  }

  renderSuccessMessage() {
    const { location: { query } } = this.props;
    return (
      <Frame title="Check your e-mail">
        <div className="Frame-body">
          <p>
            We just sent you the link to set a new password. It should arrive in the next few minutes!
          </p>
        </div>
        <div className="Frame-footer" style={{ textAlign: 'center' }}>
          <Link to={{ pathname: '/login', query }}>
            Back to login
          </Link>
        </div>
      </Frame>
    );
  }

  render() {
    const { sent } = this.state;
    return (
      <Page>
        <Helmet title="Reset your password" />
        { !sent ? this.renderForm() : this.renderSuccessMessage() }
      </Page>
    );
  }

}

const mapStateToProps = state => {
  return {
    isResettingPassword: state.session.isResettingPassword,
    error: state.session.resetPasswordError,
  };
};

export default connect(mapStateToProps)(ResetPassword);
