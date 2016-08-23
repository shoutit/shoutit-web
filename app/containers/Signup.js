import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import { getLoggedUser } from '../reducers/session';
import { getCurrentLocation } from '../reducers/currentLocation';

import Helmet from '../utils/Helmet';

import { signup, resetErrors } from '../actions/session';

import Button from '../forms/Button';
import HorizontalRule from '../widgets/HorizontalRule';
import AncillaryText from '../widgets/AncillaryText';
import TextField from '../forms/TextField';
import FieldsGroup from '../forms/FieldsGroup';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import SocialLoginForm from '../auth/SocialLoginForm';
import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';

const MESSAGES = defineMessages({
  pageTitle: {
    id: 'signup.page.title',
    defaultMessage: 'Sign Up',
  },
  separatorLabelWith: {
    id: 'signup.separatorLabel.with',
    defaultMessage: 'with',
  },
  separatorLabelOr: {
    id: 'signup.separatorLabel.or',
    defaultMessage: 'or',
  },
  firstNamePlaceholder: {
    id: 'signup.form.firstName.placeholder',
    defaultMessage: 'First name',
  },
  lastNamePlaceholder: {
    id: 'signup.form.lastName.placeholder',
    defaultMessage: 'Last name',
  },
  emailPlaceholder: {
    id: 'signup.form.email.placeholder',
    defaultMessage: 'E-mail address',
  },
  passwordPlaceholder: {
    id: 'signup.form.password.placeholder',
    defaultMessage: 'Choose a password',
  },
});

export class Signup extends Component {

  static propTypes = {
    error: PropTypes.object,
    isSigningUp: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    currentLocation: PropTypes.object,
    location: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    loggedUser: PropTypes.object,
  };

  state = {
    success: false,
  };

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
      if (location && this.fields[location].getValue()) {
        this.fields[location].select();
      } else if (location) {
        this.fields[location].focus();
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetErrors());
  }

  fields = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const { isSigningUp, dispatch, currentLocation } = this.props;

    if (isSigningUp) {
      return;
    }

    const firstName = this.fields.firstName.getValue();
    const lastName = this.fields.lastName.getValue();
    const email = this.fields.email.getValue();
    const password = this.fields.password.getValue();

    if (!firstName) {
      this.fields.firstName.focus();
      return;
    }
    if (!lastName) {
      this.fields.lastName.focus();
      return;
    }
    if (!email) {
      this.fields.email.focus();
      return;
    }
    if (!password) {
      this.fields.password.focus();
      return;
    }
    if (email && password) {
      this.fields.firstName.blur();
      this.fields.lastName.blur();
      this.fields.email.blur();
      this.fields.password.blur();
      dispatch(signup(
        { email, password, firstName, lastName, location: currentLocation }
      )).then(() => {
        this.setState({ success: true });
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

  renderForm() {
    const { isSigningUp, location: { query }, error, currentLocation } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Frame title={ formatMessage(MESSAGES.pageTitle) }>

        <div className="Frame-body">

          <HorizontalRule label={ formatMessage(MESSAGES.separatorLabelWith) } />

          <div className="Frame-form">
            <SocialLoginForm
              disabled={ isSigningUp }
              onLoginSuccess={ () => this.redirectToNextPage() }
              currentLocation={ currentLocation }
            />
          </div>

          <HorizontalRule label={ formatMessage(MESSAGES.separatorLabelOr) } />

          { error &&
            !getErrorsByLocation(error, 'email') &&
            !getErrorsByLocation(error, 'password') &&
            !getErrorsByLocation(error, 'first_name') &&
            !getErrorsByLocation(error, 'last_name') &&
            <p className="htmlErrorParagraph">
              <FormattedMessage
                defaultMessage="Sign up did not work for an unknown error. Please try again later or contact support."
                id="signup.form.error.unknown"
              />
            </p>
        }

          <form onSubmit={ e => this.handleFormSubmit(e) } className="Form Frame-form" noValidate>

            <FieldsGroup>
              <TextField
                flex
                ref={ el => { this.fields.firstName = el; } }
                disabled={ isSigningUp }
                name="first_name"
                type="text"
                error={ error }
                placeholder={ formatMessage(MESSAGES.firstNamePlaceholder) }
              />
              <TextField
                flex
                error={ error }
                ref={ el => { this.fields.lastName = el; } }
                disabled={ isSigningUp }
                name="last_name"
                type="text"
                placeholder={ formatMessage(MESSAGES.lastNamePlaceholder) }
              />
            </FieldsGroup>

            <TextField
              ref={ el => { this.fields.email = el; } }
              disabled={ isSigningUp }
              name="email"
              type="email"
              error={ error }
              placeholder={ formatMessage(MESSAGES.emailPlaceholder) }
            />

            <TextField
              error={ error }
              ref={ el => { this.fields.password = el; } }
              disabled={ isSigningUp }
              name="password"
              type="password"
              placeholder={ formatMessage(MESSAGES.passwordPlaceholder) }
            />

            <AncillaryText>
              <FormattedMessage
                defaultMessage="By signing up, you agree to our {linkToTermsOfService}, {linkToRules} and {linkToPrivacyPolicy}."
                id="signup.form.conditions"
                values={ {
                  linkToTermsOfService: <Link to="/static/tos"><FormattedMessage id="signup.form.linkToTermsOfService" defaultMessage="Terms of Service" /></Link>,
                  linkToPrivacyPolicy: <Link to="/static/privacy"><FormattedMessage id="signup.form.linkToPrivacyPolicy" defaultMessage="Privacy Policy" /></Link>,
                  linkToRules: <Link to="/static/rules"><FormattedMessage id="signup.form.linkToRules" defaultMessage="Marketplace Rules" /></Link>,
                } }
              />
            </AncillaryText>

            <Button
              style={ { marginTop: '1rem' } }
              kind="primary"
              block
              disabled={ isSigningUp }>
              { isSigningUp ?
                <FormattedMessage
                  defaultMessage="Creating account…"
                  id="signup.form.buttonLabel.loading"
                /> :
                <FormattedMessage
                  defaultMessage="Sign up"
                  id="signup.form.buttonLabel.submit"
                />
               }
            </Button>
          </form>
        </div>
        <div className="Frame-footer" style={ { textAlign: 'center' } }>
          <FormattedMessage
            id="signup.form.toSignup"
            defaultMessage="Already have an account? {loginLink}"
            values={ {
              loginLink: (
                <Link to={ { pathname: '/login', query } }>
                  <FormattedMessage
                    id="signup.form.loginLink"
                    defaultMessage="Log in" />
                </Link>
              ),
            } }
          />
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
            <FormattedMessage
              defaultMessage="Hi {name}, thanks for signing up!"
              values={ loggedUser }
              id="signup.success.welcomeMessage-1"
            />

            <br /><br />
            <FormattedMessage
              defaultMessage="Please verify your e-mail address by clicking on the link we just sent to { email }."
              values={ { email: loggedUser.email } }
              id="signup.success.welcomeMessage-2"
            />
          </p>
        </div>
        <div className="Frame-footer" style={ { textAlign: 'center' } }>
          <Link to={ { pathname: '/', query } }>
            <FormattedMessage
              defaultMessage="To your home page"
              values={ { email: loggedUser.email } }
              id="signup.success.homeLink"
              />
          </Link>
        </div>
      </Frame>
    );
  }

  render() {
    const { success } = this.state;

    return (
      <Page className="Signup">
        <Helmet title={ this.props.intl.formatMessage(MESSAGES.pageTitle) } />
        { !success ? this.renderForm() : this.renderSuccessMessage() }
      </Page>
    );
  }

}

const mapStateToProps = state => {
  return {
    loggedUser: getLoggedUser(state),
    isSigningUp: state.session.isSigningUp,
    error: state.session.signupError,
    currentLocation: getCurrentLocation(state),
  };
};

export default connect(mapStateToProps)(injectIntl(Signup));
