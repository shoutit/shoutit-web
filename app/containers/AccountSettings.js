import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import Page from '../layout/Page';
import Helmet from '../utils/Helmet';
import RequiresLogin from '../auth/RequiresLogin';

import CardWithList from '../ui/CardWithList';
import TextField from '../ui/TextField';
import Form from '../ui/Form';
import Button from '../ui/Button';

import { updateProfile, updatePassword } from '../actions/users';
import { resetErrors } from '../actions/session';
import { getLoggedUser } from '../selectors';

if (process.env.BROWSER) {
  require('./Settings.scss');
}

const MESSAGES = defineMessages({
  title: {
    id: 'accountSettings.page.title',
    defaultMessage: 'Settings',
  },
  oldPasswordPlaceholder: {
    id: 'accountSettings.oldPassword.placeholder',
    defaultMessage: 'Old password',
  },
  newPasswordPlaceholder: {
    id: 'accountSettings.newPassword.placeholder',
    defaultMessage: 'New password',
  },
  repeatPasswordPlaceholder: {
    id: 'accountSettings.repeatPassword.placeholder',
    defaultMessage: 'Repeat the new password',
  },
  emailLabel: {
    id: 'accountSettings.account.email.label',
    defaultMessage: 'E-mail',
  },
  mobileLabel: {
    id: 'accountSettings.account.mobile.label',
    defaultMessage: 'Mobile',
  },
  usernameLabel: {
    id: 'accountSettings.account.username.label',
    defaultMessage: 'Username',
  },
});

export class AccountSettings extends Component {

  static propTypes = {
    session: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    updatePassword: PropTypes.func.isRequired,
    resetErrors: PropTypes.func.isRequired,
    updateAccount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    profile: {},
  }

  constructor(props) {
    super(props);
    this.handlePasswordFormSubmit = this.handlePasswordFormSubmit.bind(this);
    this.handleAccountFormSubmit = this.handleAccountFormSubmit.bind(this);
    this.state = this.getState(props.profile);
  }

  componentWillUnmount() {
    this.props.resetErrors();
  }

  getState(profile) {
    return {
      email: profile.email,
      username: profile.username,
      mobile: profile.mobile,
      isPasswordSet: profile.isPasswordSet,
    };
  }

  handleAccountFormSubmit() {
    if (!this.didAccountChange()) {
      return;
    }
    const { updateAccount, profile } = this.props;
    const { id } = profile;
    const { email, mobile, username } = this.state;
    updateAccount({ id, email, mobile, username }).then(data => {
      this.setState(this.getState(data.entities.users[data.result]));
    });
  }

  handlePasswordFormSubmit() {
    const { updatePassword } = this.props;
    const { new_password, new_password2, old_password } = this.state;
    updatePassword({ new_password, new_password2, old_password }).then(() => {
      this.setState({
        new_password: undefined,
        new_password2: undefined,
        old_password: undefined,
        isPasswordSet: true,
      });
      if (this.refs.old_password) {
        this.refs.old_password.setValue('');
      }
      this.refs.new_password.setValue('');
      this.refs.new_password2.setValue('');
    });
  }

  didAccountChange() {
    const { profile } = this.props;
    return this.state.email !== profile.email ||
      this.state.username !== profile.username ||
      this.state.mobile !== profile.mobile;
  }

  isChangingPassword() {
    return !!this.state.new_password && !!this.state.new_password2;
  }

  render() {
    const { profile, session } = this.props;
    const { formatMessage } = this.props.intl;

    const error = profile.updateError;
    const navigation = (
      <CardWithList title="Profile Settings">
        <Link to="/settings/profile" activeClassName="active">
          <FormattedMessage id="accountSettings.menu.profile" defaultMessage="Public Profile" />
        </Link>
        <Link to="/settings/account" activeClassName="active">
          <FormattedMessage id="accountSettings.menu.account" defaultMessage="Your Account" />
        </Link>
      </CardWithList>
    );

    return (
      <RequiresLogin>
        <Page className="Settings" startColumn={ navigation }>
          <Helmet title={ formatMessage(MESSAGES.title) } />

          <div className="Settings-layout">
            <Form onSubmit={ this.handlePasswordFormSubmit }>
              <h3>
                <FormattedMessage id="accountSettings.password.formTitle" defaultMessage="Change your password" />
              </h3>
              { this.state.isPasswordSet &&
                <TextField
                  ref="old_password"
                  name="old_password"
                  placeholder={ formatMessage(MESSAGES.oldPasswordPlaceholder) }
                  type="password"
                  onChange={ old_password => this.setState({ old_password }) }
                  ancillary={
                    <Link to="/login/password">
                      <FormattedMessage id="accountSettings.oldPassword.recoverLink" defaultMessage="Recover your password" />
                    </Link>
                  }
                  error={ session.updatePasswordError }
                />
               }
              <div className="Settings-main-password">
                <TextField
                  ref="new_password"
                  name="new_password"
                  placeholder={ formatMessage(MESSAGES.newPasswordPlaceholder) }
                  type="password"
                  onChange={ new_password => this.setState({ new_password }) }
                  error={ session.updatePasswordError } />
                <TextField
                  ref="new_password2"
                  name="new_password2"
                  placeholder={ formatMessage(MESSAGES.repeatPasswordPlaceholder) }
                  type="password"
                  onChange={ new_password2 => this.setState({ new_password2 }) }
                  error={ session.updatePasswordError } />
              </div>
              <div className="Settings-actions">
                <Button action="primary" disabled={ session.isUpdatingPassword || !this.isChangingPassword() }>
                  <FormattedMessage id="accountSettings.password.submit" defaultMessage="Change password" />
                </Button>
              </div>
            </Form>
          </div>
          <div className="Settings-layout">
            <Form onSubmit={ this.handleAccountFormSubmit }>
              <h3>
                <FormattedMessage id="accountSettings.account.formTitle" defaultMessage="Your Account" />
              </h3>
              <TextField
                name="email"
                label={ formatMessage(MESSAGES.emailLabel) }
                value={ profile.email }
                onChange={ email => this.setState({ email }) }
                error={ error }
                disabled={ profile.isUpdating }
              />
              <TextField
                name="mobile"
                label={ formatMessage(MESSAGES.mobileLabel) }
                value={ profile.mobile }
                onChange={ mobile => this.setState({ mobile }) }
                error={ error }
                disabled={ profile.isUpdating }
              />
              <TextField
                name="username"
                label={ formatMessage(MESSAGES.usernameLabel) }
                value={ profile.username }
                onChange={ username => this.setState({ username }) }
                error={ error }
                disabled={ profile.isUpdating }
              />
              <div className="Settings-actions">
                <Button action="primary" disabled={ !this.didAccountChange() || profile.isUpdating }>
                  { profile.isUpdating &&
                    <FormattedMessage id="accountSettings.account.updatingLabel" defaultMessage="Updating…" /> }
                  { this.didAccountChange() && !profile.isUpdating &&
                    <FormattedMessage id="accountSettings.account.updateLabel" defaultMessage="Update account" /> }
                  { !this.didAccountChange() && !profile.isUpdating &&
                    <FormattedMessage id="accountSettings.account.updatedLabel" defaultMessage="Account updated" /> }
                </Button>
              </div>

            </Form>
          </div>
        </Page>
      </RequiresLogin>
    );
  }

}

const mapStateToProps = state => ({
  profile: getLoggedUser(state),
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  updateAccount: data => dispatch(updateProfile(data)),
  updatePassword: data => dispatch(updatePassword(data)),
  resetErrors: () => {
    dispatch(resetErrors());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountSettings));
