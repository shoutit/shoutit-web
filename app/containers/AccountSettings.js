import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import Panel from '../layout/Panel';
import Page, { StartColumn, Body } from '../layout/Page';
import Helmet from '../utils/Helmet';
import RequiresLogin from '../auth/RequiresLogin';

import TextField from '../forms/TextField';
import Form from '../forms/Form';
import FieldsGroup from '../forms/FieldsGroup';
import Button from '../forms/Button';
import SettingsNavigation from '../settings/SettingsNavigation';

import { updateProfile, updatePassword } from '../actions/users';
import { resetErrors } from '../actions/session';
import { getLoggedUser } from '../reducers/session';

import './Settings.scss';

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
    intl: PropTypes.object.isRequired,
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

  new_password: null
  new_password2: null
  old_password: null

  handleAccountFormSubmit() {
    if (!this.didChange()) {
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
      if (this.old_password) {
        this.old_password.setValue('');
      }
      this.new_password.setValue('');
      this.new_password2.setValue('');
    });
  }

  didChange() {
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
    return (
      <RequiresLogin>
        <Page className="Settings">
          <Helmet title={ formatMessage(MESSAGES.title) } appUrl="shoutit://settings" />
          <StartColumn sticky>
            <SettingsNavigation />
          </StartColumn>
          <Body>
            <Panel className="Settings-body">
              <Form onSubmit={ this.handlePasswordFormSubmit }>
                <h2>
                  <FormattedMessage id="accountSettings.password.formTitle" defaultMessage="Change your password" />
                </h2>
                { this.state.isPasswordSet &&
                  <TextField
                    ref={ el => { this.old_password = el; } }
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
                <FieldsGroup>
                  <TextField
                    flex
                    ref={ el => { this.new_password = el; } }
                    name="new_password"
                    placeholder={ formatMessage(MESSAGES.newPasswordPlaceholder) }
                    type="password"
                    onChange={ new_password => this.setState({ new_password }) }
                    error={ session.updatePasswordError } />
                  <TextField
                    flex
                    ref={ el => { this.new_password2 = el; } }
                    name="new_password2"
                    placeholder={ formatMessage(MESSAGES.repeatPasswordPlaceholder) }
                    type="password"
                    onChange={ new_password2 => this.setState({ new_password2 }) }
                    error={ session.updatePasswordError } />
                </FieldsGroup>
                <Button kind="primary" disabled={ session.isUpdatingPassword || !this.isChangingPassword() }>
                  <FormattedMessage id="accountSettings.password.submit" defaultMessage="Change password" />
                </Button>
              </Form>
            </Panel>
            <Panel className="Settings-body" block>
              <Form onSubmit={ this.handleAccountFormSubmit }>
                <h2>
                  <FormattedMessage id="accountSettings.account.formTitle" defaultMessage="Your Account" />
                </h2>
                <TextField
                  name="email"
                  label={ formatMessage(MESSAGES.emailLabel) }
                  value={ profile.email }
                  onChange={ email => this.setState({ email }) }
                  error={ profile.updateError }
                  disabled={ profile.isUpdating }
                />
                <TextField
                  name="mobile"
                  label={ formatMessage(MESSAGES.mobileLabel) }
                  value={ profile.mobile }
                  onChange={ mobile => this.setState({ mobile }) }
                  error={ profile.updateError }
                  disabled={ profile.isUpdating }
                />
                <TextField
                  name="username"
                  label={ formatMessage(MESSAGES.usernameLabel) }
                  value={ profile.username }
                  onChange={ username => this.setState({ username }) }
                  error={ profile.updateError }
                  disabled={ profile.isUpdating }
                />
                <Button kind="primary" disabled={ !this.didChange() || profile.isUpdating }>
                  { profile.isUpdating &&
                    <FormattedMessage id="accountSettings.account.updatingLabel" defaultMessage="Updating…" /> }
                  { this.didChange() && !profile.isUpdating &&
                    <FormattedMessage id="accountSettings.account.updateLabel" defaultMessage="Update account" /> }
                  { !this.didChange() && !profile.isUpdating &&
                    <FormattedMessage id="accountSettings.account.updatedLabel" defaultMessage="Account updated" /> }
                </Button>
              </Form>
            </Panel>
          </Body>
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

const Wrapped = connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountSettings));
export default Wrapped;
