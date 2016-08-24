import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Link } from 'react-router';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import Helmet from '../utils/Helmet';

import { login, resetErrors } from '../actions/session';

import Button from '../forms/Button';
import Form from '../forms/Form';
import AncillaryText from '../widgets/AncillaryText';
import HorizontalRule from '../widgets/HorizontalRule';
import TextField from '../forms/TextField';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import SocialLoginForm from '../auth/SocialLoginForm';
import { getErrorsByLocation, getErrorLocations } from '../utils/APIUtils';
import { getLoggedUser } from '../reducers/session';

const MESSAGES = defineMessages({
  title: {
    id: 'login.title',
    defaultMessage: 'Login',
  },
  titleWithAction: {
    id: 'login.titleWithAction',
    defaultMessage: 'Please login to continue',
  },
  emailPlaceholder: {
    id: 'login.emailPlaceholder',
    defaultMessage: 'E-mail or username',
  },
  passwordPlaceholder: {
    id: 'login.passwordPlaceholder',
    defaultMessage: 'Password',
  },
  recoverPassword: {
    id: 'login.recoverPassword',
    defaultMessage: 'Recover your password',
  },
  loggingInButton: {
    id: 'login.loggingInButton',
    defaultMessage: 'Logging in…',
    description: 'Label of login button while logging in',
  },
  loginButton: {
    id: 'login.loginButton',
    defaultMessage: 'Login',
  },
  separatorLabelWith: {
    id: 'login.separatorLabel.with',
    defaultMessage: 'with',
  },
  separatorLabelOr: {
    id: 'login.separatorLabel.or',
    defaultMessage: 'or',
  },
});

export class Login extends Component {

  static propTypes = {
    error: PropTypes.object,
    isLoggingIn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
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
    email: null,
    password: null,
  }

  submit(e) {
    e.preventDefault();

    const { isLoggingIn, dispatch } = this.props;

    if (isLoggingIn) {
      return;
    }

    const form = e.target;
    const email = this.fields.email.getValue();
    const password = this.fields.password.getValue();
    // const keepSession = this.fields.keep_session.checked;

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
      dispatch(login({ email, password }))
        .then(() => this.redirectToNextPage());
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

    const { formatMessage } = this.props.intl;
    const title = formatMessage(query.login_action ? MESSAGES.titleWithAction : MESSAGES.title);
    return (
      <Page className="Login">
        <Helmet title={ title } />
        <Frame title={ title }>

          <div className="Frame-body">

            <HorizontalRule label={ formatMessage(MESSAGES.separatorLabelWith) } />

            <div className="Frame-form">
              <SocialLoginForm disabled={ isLoggingIn } onLoginSuccess={ () => this.redirectToNextPage() } />
            </div>

            <HorizontalRule label={ formatMessage(MESSAGES.separatorLabelOr) } />

            { error &&
              !getErrorsByLocation(error, 'email') &&
              !getErrorsByLocation(error, 'password') &&
              <p className="htmlErrorParagraph">
                Login did not work for an unknown error. Please try again later or contact support.
              </p>
            }

            <Form onSubmit={ this.submit } className="Frame-form">
              <TextField
                ref={ el => { this.fields.email = el; } }
                disabled={ isLoggingIn }
                name="email"
                type="text"
                error={ error }
                placeholder={ formatMessage(MESSAGES.emailPlaceholder) }
              />
              <TextField
                error={ error }
                ref={ el => { this.fields.password = el; } }
                disabled={ isLoggingIn }
                name="password"
                type="password"
                placeholder={ formatMessage(MESSAGES.passwordPlaceholder) }
              />

              <Button
                type="submit"
                style={ { marginTop: '1rem' } }
                kind="primary"
                block
                disabled={ isLoggingIn }>
                { formatMessage(isLoggingIn ? MESSAGES.loggingInButton : MESSAGES.loginButton) }
              </Button>

              <AncillaryText>
                <Link to={ { pathname: '/login/password', query } } className="forgot-btn">
                  { formatMessage(MESSAGES.recoverPassword) }
                </Link>
              </AncillaryText>

            </Form>
          </div>
          <div className="Frame-footer" style={ { textAlign: 'center' } }>
            <FormattedMessage
              id="login.form.toSignup"
              defaultMessage="New to shoutit? {signupLink}"
              values={ {
                signupLink: (
                  <Link to={ { pathname: '/signup', query } }>
                    <FormattedMessage
                      id="login.form.signupLink"
                      defaultMessage="Sign up" />
                  </Link>
                ),
              } }
            />
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

export default connect(mapStateToProps)(injectIntl(Login));
