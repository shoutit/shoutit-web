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
// import DestructiveAction from '../ui/DestructiveAction';

import { updateProfile } from '../actions/users';

if (process.env.BROWSER) {
  require('./Settings.scss');
}
export class AccountSettings extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.state = this.getStateFromProfile(props.profile);
  }

  getStateFromProfile(profile) {
    return {
      email: profile.email,
      username: profile.username,
      mobile: profile.mobile,
    };
  }

  submitProfileForm() {
    const { id } = this.props.profile;
    this.props.updateProfile({ id, ...this.state });
  }

  updateProfile() {
    if (!this.didChange()) {
      return;
    }
    const { id } = this.props.profile;
    this.props.updateProfile({ id, ...this.state }).then(data => {
      this.setState(this.getStateFromProfile(data.entities.users[data.result]));
    });
  }

  didChange() {
    const { profile } = this.props;
    return this.state.email !== profile.email ||
        this.state.username !== profile.username ||
        this.state.mobile !== profile.mobile;
  }

  handleFieldChange(name, value) {
    this.setState({ [name]: value });
  }
  //
  // handleDeactivateClick() {
  //   if (confirm('Really deactivate account?')) { // eslint-disable-line
  //     console.log('done');
  //   }
  // }

  handleSubmit(e) {
    e.preventDefault();
    this.updateProfile();
  }

  render() {
    // const { profileData, accountData, didProfileDataChange } = this.state;
    const { profile } = this.props;
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
            <Form onSubmit={ this.handleSubmit }>

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
{/*
              <h3>Change Password</h3>

              <div className="Settings-main-password">
                <TextField name="password" placeholder="New password" type="password" />
                <TextField name="password_2" placeholder="Repeat the new password" type="password" />
              </div>
*/}
              <div className="Settings-actions">
                <Button action="primary" disabled={ !this.didChange() || profile.isUpdating }>
                  { profile.isUpdating && 'Updating…' }
                  { this.didChange() && !profile.isUpdating && 'Update account' }
                  { !this.didChange() && !profile.isUpdating && 'Account updated' }
                </Button>
              </div>

              {/* <DestructiveAction label="Deactivate account" description="Will delete your shouts, destroy your car and your house." onClick={ this.handleDeactivateClick } />*/}

            </Form>
          </div>
        </Page>
      </RequiresLogin>
    );
  }

}

const mapStateToProps = state => ({
  profile: state.entities.users[state.session.user],
});

const mapDispatchToProps = dispatch => ({
  updateProfile: data => dispatch(updateProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
