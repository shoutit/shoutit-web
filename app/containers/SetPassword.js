import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Helmet from '../utils/Helmet';

import { setPassword } from '../actions/session';

import Button from '../forms/Button';
import TextField from '../forms/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

const MESSAGES = defineMessages({
  pageTitle: {
    id: 'setPassword.page.title',
    defaultMessage: 'Set a new password',
  },
  passwordPlaceholder: {
    id: 'setPassword.form.passwordPlaceholder',
    defaultMessage: 'Enter a password',
  },
});
export class SetPassword extends Component {

  static propTypes = {
    error: PropTypes.object,
    isSettingPassword: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
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
      <Frame title={ this.props.intl.formatMessage(MESSAGES.pageTitle) }>

        <div className="Frame-body">

          { error && !getErrorsByLocation(error, 'new_password') &&
            <p className="htmlErrorParagraph">
              <FormattedMessage
                id="setPassword.error.unknown"
                defaultMessage="Could not set your password because of an unknown error. Please try again later or contact support."
              />
            </p>
          }

          { error && getErrorsByLocation(error, 'reset_token') &&
            <p className="htmlErrorParagraph">
              <FormattedMessage
                id="setPassword.error.wrongLink"
                defaultMessage="Could not set your password because this link is wrong. {linkToPasswordRecovery}"
                values={ {
                  linkToPasswordRecovery: (
                    <Link to="/login/password">
                      <FormattedMessage id="setPassword.error.linkToPasswordRecovery" defaultMessage="Click here to request a new link" />
                    </Link>
                    ),
                } }
              />
              .
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
              placeholder={ this.props.intl.formatMessage(MESSAGES.passwordPlaceholder) }
              onChange={ password => this.setState({ password }) }
            />

            <Button
              style={ { marginTop: '1rem' } }
              kind="primary"
              block
              disabled={ isSettingPassword }
            >
              { isSettingPassword ?
                <FormattedMessage
                  id="setPassword.form.button.waiting"
                  defaultMessage="Please wait…"
                /> :
                <FormattedMessage
                  id="setPassword.form.button"
                  defaultMessage="Save password"
                /> }
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
            <FormattedMessage
              id="setPassword.confirmMessage"
              defaultMessage="Your password has been updated. Now you can login again!"
            />
          </p>
          <div className="Frame-form" style={ { textAlign: 'center' } }>
            <Button kind="primary" to="/login">
              <FormattedMessage
                id="setPassword.confirmMessage.toLogin"
                defaultMessage="To Login"
              />
            </Button>
          </div>
        </div>
      </Frame>
    );
  }

  render() {
    const { sent } = this.state;
    return (
      <Page>
        <Helmet title={ this.props.intl.formatMessage(MESSAGES.pageTitle) } />
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

export default connect(mapStateToProps)(injectIntl(SetPassword));
