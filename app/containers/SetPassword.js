import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from '../utils/Helmet';

import { setPassword } from '../actions/session';

import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

export class SetPassword extends Component {

  static propTypes = {
    error: PropTypes.object,
    isSettingPassword: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  state = {
    sent: false,
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (error && prevProps.error !== error) {
      let location;
      const errorLocations = getErrorLocations(error);
      if (errorLocations.includes('new_password')) {
        location = 'newPassword';
      }
      if (location && this.refs[location].getValue()) {
        this.refs[location].select();
      } else if (location) {
        this.refs[location].focus();
      }
    }
  }

  handleFormSubmit(e) {
    const { isSettingPassword, dispatch, params: { resetToken } } = this.props;
    e.preventDefault();
    const newPassword = this.refs.newPassword.getValue();
    if (isSettingPassword) {
      return;
    }
    if (!newPassword) {
      this.refs.newPassword.focus();
      return;
    }
    this.refs.newPassword.blur();
    dispatch(setPassword(newPassword, resetToken)).then(() => this.setState({ sent: true }));
  }

  renderForm() {
    const { isSettingPassword, error } = this.props;
    return (
      <Frame title="Set a new password">

        <div className="Frame-body">

          { error && !getErrorsByLocation(error, 'new_password') &&
            <p className="htmlErrorParagraph">
              Could not set your password because of an unknown error. Please try again later or contact support.
            </p>
          }

          { error && getErrorsByLocation(error, 'reset_token') &&
            <p className="htmlErrorParagraph">
              Could not set your password because this link is wrong. <Link to="/login/password">Click here to request a new link</Link>.
            </p>
          }

          <form onSubmit={ e => this.handleFormSubmit(e) } className="Frame-form" noValidate>

            <TextField
              autoFocus
              ref="newPassword"
              disabled={ isSettingPassword }
              name="newPassword"
              type="password"
              error={ error }
              placeholder="Enter a password"
              onChange={ password => this.setState({ password }) }
            />

            <Button
              style={ { marginTop: '1rem' } }
              action="primary"
              block
              disabled={ isSettingPassword }
            >
              { isSettingPassword ? 'Please wait…' : 'Continue' }
            </Button>

          </form>
        </div>
      </Frame>
    );
  }

  renderSuccessMessage() {
    return (
      <Frame title="All done">
        <div className="Frame-body">
          <p>
            Your password has been updated. Now you can login again!
          </p>
          <div className="Frame-form" style={ { textAlign: 'center' } }>
            <Button action="primary" to="/login">To login</Button>
          </div>
        </div>
      </Frame>
    );
  }

  render() {
    const { sent } = this.state;
    return (
      <Page>
        <Helmet title="Set a new password" />
        { !sent ? this.renderForm() : this.renderSuccessMessage() }
      </Page>
    );
  }

}

const mapStateToProps = state => {
  return {
    isSettingPassword: state.session.isSettingPassword,
    error: state.session.setPasswordError,
  };
};

export default connect(mapStateToProps)(SetPassword);
