import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { setPassword, resetSessionErrors } from '../actions/session';

import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

export class SetPassword extends Component {

  state = {
    sent: false,
  };

  componentDidUpdate(prevProps) {
    const { setPasswordError } = this.props;

    if (setPasswordError && prevProps.setPasswordError !== setPasswordError) {
      let location;
      const errorLocations = getErrorLocations(setPasswordError);
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
    const { isSettingPassword, setPasswordError, dispatch } = this.props;
    return (
      <Frame title="Set a new password">

        <div className="Frame-body">

          { setPasswordError && !getErrorsByLocation(setPasswordError, 'new_password') &&
            <p className="htmlErrorParagraph">
              Could not set your password because of an unknown error. Please try again later or contact support.
            </p>
          }

          { setPasswordError && getErrorsByLocation(setPasswordError, 'reset_token') &&
            <p className="htmlErrorParagraph">
              Could not set your password because this link is wrong. <Link to="/login/password">Click here to request a new link</Link>.
            </p>
          }

          <form onSubmit={ e => this.handleFormSubmit(e) } className="Frame-form" noValidate>

            <TextField
              autoFocus
              ref="newPassword"
              block
              disabled={ isSettingPassword }
              name="newPassword"
              type="password"
              errors={ setPasswordError && getErrorsByLocation(setPasswordError, 'new_password') }
              placeholder="Enter a password"
              onBlur={ () => dispatch(resetSessionErrors()) }
              onChange={ password => {
                dispatch(resetSessionErrors());
                this.setState({ password });
              }}
            />

            <Button
              style={{ marginTop: '1rem' }}
              primary
              block
              disabled={ isSettingPassword }
              label={ isSettingPassword ? 'Please wait…' : 'Continue' }
              />

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
          <div className="Frame-form" style={{ textAlign: 'center' }}>
            <Button primary to="/login" label="To login" />
          </div>
        </div>
      </Frame>
    );
  }

  render() {
    const { sent } = this.state;
    return (
      <Page title="Set a new password">
        { !sent ? this.renderForm() : this.renderSuccessMessage() }
      </Page>
    );
  }

}

const mapStateToProps = state => {
  return {
    isSettingPassword: state.session.isSettingPassword,
    setPasswordError: state.session.setPasswordError,
  };
};

export default connect(mapStateToProps)(SetPassword);
