import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Helmet from '../utils/Helmet';

import { resetPassword } from '../actions/session';

import Form from '../forms/Form';
import Button from '../forms/Button';
import TextField from '../forms/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';
import AncillaryText from '../widgets/AncillaryText';

import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

const MESSAGES = defineMessages({
  title: {
    id: 'resetPassword.title',
    defaultMessage: 'Reset your password',
  },
  emailPlaceholder: {
    id: 'resetPassword.form.email.placeholder',
    defaultMessage: 'Enter your e-mail or username',
  },
});

export class ResetPassword extends Component {

  static propTypes = {
    error: PropTypes.object,
    isResettingPassword: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
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
      if (errorLocations.includes('email')) {
        location = 'email';
      }

      if (location && this.fields[location].getValue()) {
        this.fields[location].select();
      } else if (location) {
        this.fields[location].focus();
      }
    }
  }

  fields = {
    email: null,
  }

  handleFormSubmit(e) {
    const { isResettingPassword, dispatch } = this.props;
    e.preventDefault();
    const email = this.fields.email.getValue();
    if (isResettingPassword) {
      return;
    }
    if (!email) {
      this.fields.email.focus();
      return;
    }
    this.fields.email.blur();
    dispatch(resetPassword(email)).then(() => this.setState({ sent: true }));
  }

  renderForm() {
    const { formatMessage } = this.props.intl;
    return (
      <Frame title={ formatMessage(MESSAGES.title) }>

        <div className="Frame-body">

          { this.props.error && !getErrorsByLocation(this.props.error, 'email') &&
            <p className="htmlErrorParagraph">
              <FormattedMessage
                id="resetPassword.unknownError"
                defaultMessage="Could not reset your password because of an unknown error. Please try again later or contact support."
              />
            </p>
        }

          <Form onSubmit={ e => this.handleFormSubmit(e) } className="Frame-form">

            <TextField
              autoFocus
              ref={ el => { this.fields.email = el; } }
              disabled={ this.props.isResettingPassword }
              name="email"
              type="email"
              error={ this.props.error }
              placeholder={ formatMessage(MESSAGES.emailPlaceholder) }
              onChange={ email => this.setState({ email }) }
            />

            <Button
              type="submit"
              kind="primary"
              block
              disabled={ this.props.isResettingPassword }>
              { this.props.isResettingPassword ?
                <FormattedMessage
                  id="resetPassword.submit.loadingLabel"
                  defaultMessage="Please wait…"
                />
                :
                <FormattedMessage
                  id="resetPassword.submit.buttonLabel"
                  defaultMessage="Send link"
                />
              }
            </Button>

            <AncillaryText>
              <FormattedMessage
                id="resetPassword.submit.instructions"
                defaultMessage="You will receive a link to change the password."
              />
            </AncillaryText>

          </Form>
        </div>
        <div className="Frame-footer" style={ { textAlign: 'center' } }>
          <Link to={ { pathname: '/login', query: this.props.location.query } }>
            <FormattedMessage
              id="resetPassword.back"
              defaultMessage="Back to login"
            />
          </Link>
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
            <FormattedMessage
              id="resetPassword.confirmationMessage"
              defaultMessage="We just sent you the link to set a new password. It should arrive in the next few minutes!"
            />
          </p>
        </div>
        <div className="Frame-footer" style={ { textAlign: 'center' } }>
          <Link to={ { pathname: '/login', query } }>
            <FormattedMessage
              id="resetPassword.back"
              defaultMessage="Back to login"
            />
          </Link>
        </div>
      </Frame>
    );
  }

  render() {
    const { sent } = this.state;
    return (
      <Page>
        <Helmet hideBadge title={ this.props.intl.formatMessage(MESSAGES.title) } />
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

export default connect(mapStateToProps)(injectIntl(ResetPassword));
