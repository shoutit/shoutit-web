import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

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
    const error = profile.updateError;
    const navigation = (
      <CardWithList title="Profile Settings">
        <Link to="/settings/profile" activeClassName="active">
          Public Profile
        </Link>
        <Link to="/settings/account" activeClassName="active">
          Your Account
        </Link>
      </CardWithList>
    );
    return (
      <RequiresLogin>
        <Page className="Settings" startColumn={ navigation }>
          <Helmet title="Account settings" />

          <div className="Settings-layout">
            <Form onSubmit={ this.handlePasswordFormSubmit }>
              <h3>Change Password</h3>
              { this.state.isPasswordSet &&
                <TextField
                  ref="old_password"
                  name="old_password"
                  placeholder="Old password"
                  type="password"
                  onChange={ old_password => this.setState({ old_password }) }
                  ancillary={ <Link to="/login/password">Recover your password</Link> }
                  error={ session.updatePasswordError }
                />
               }
              <div className="Settings-main-password">
                <TextField
                  ref="new_password"
                  name="new_password"
                  placeholder="New password"
                  type="password"
                  onChange={ new_password => this.setState({ new_password }) }
                  error={ session.updatePasswordError } />
                <TextField
                  ref="new_password2"
                  name="new_password2"
                  placeholder="Repeat the new password"
                  type="password"
                  onChange={ new_password2 => this.setState({ new_password2 }) }
                  error={ session.updatePasswordError } />
              </div>
              <div className="Settings-actions">
                <Button action="primary" disabled={ session.isUpdatingPassword || !this.isChangingPassword() }>
                  Change password
                </Button>
              </div>
            </Form>
          </div>
          <div className="Settings-layout">
            <Form onSubmit={ this.handleAccountFormSubmit }>
              <h3>Your Account</h3>
              <TextField
                name="email"
                label="E-mail"
                value={ profile.email }
                onChange={ email => this.setState({ email }) }
                error={ error }
                disabled={ profile.isUpdating }
              />
              <TextField
                name="mobile"
                label="Mobile"
                value={ profile.mobile }
                onChange={ mobile => this.setState({ mobile }) }
                error={ error }
                disabled={ profile.isUpdating }
              />
              <TextField
                name="username"
                label="Username"
                value={ profile.username }
                onChange={ username => this.setState({ username }) }
                error={ error }
                disabled={ profile.isUpdating }
              />
              <div className="Settings-actions">
                <Button action="primary" disabled={ !this.didAccountChange() || profile.isUpdating }>
                  { profile.isUpdating && 'Updating…' }
                  { this.didAccountChange() && !profile.isUpdating && 'Update account' }
                  { !this.didAccountChange() && !profile.isUpdating && 'Account updated' }
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
