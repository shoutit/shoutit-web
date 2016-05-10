import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { connect } from 'react-redux';
import Page from '../layout/Page';
import Helmet from '../utils/Helmet';
import RequiresLogin from '../auth/RequiresLogin';

import ProfileAvatarEditable from '../users/ProfileAvatarEditable';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Form from '../ui/Form';
import Button from '../ui/Button';
import CardWithList from '../ui/CardWithList';
import Picker from '../ui/Picker';
import LocationField from '../ui/LocationField';
import { updateProfile } from '../actions/users';

if (process.env.BROWSER) {
  require('./Settings.scss');
}
export class ProfileSettings extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
  };

  static defaultProps = {
    profile: {},
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.state = this.getStateFromProfile(props.profile);
  }

  getStateFromProfile(profile) {
    return {
      first_name: profile.firstName,
      last_name: profile.lastName,
      gender: profile.gender,
      bio: profile.bio,
      website: profile.website,
    };
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

  handleFieldChange(name, value) {
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.updateProfile();
  }

  didChange() {
    const { profile } = this.props;
    return this.state.first_name !== profile.firstName ||
      this.state.last_name !== profile.lastName ||
      this.state.gender !== profile.gender ||
      this.state.bio !== profile.bio ||
      this.state.website !== profile.website;
  }

  render() {
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
          <Helmet title="Your Profile" />
          <div className="Settings-layout">
            <Form onSubmit={ this.handleSubmit }>

              <h3>Public Profile</h3>

              <div className="Settings-profile-avatar">
                <ProfileAvatarEditable profile={ profile } size="huge" />
              </div>

              <div className="Settings-profile-name">

                <TextField
                  name="first_name"
                  label="First Name"
                  value={ profile.firstName }
                  onChange={ first_name => this.setState({ first_name }) }
                  error={ error }
                  disabled={ profile.isUpdating }
                />

                <TextField
                  name="last_name"
                  label="Last Name"
                  value={ profile.lastName }
                  onChange={ last_name => this.setState({ last_name }) }
                  error={ error }
                  disabled={ profile.isUpdating }
                />

                <Picker
                  name="gender"
                  label="Gender"
                  value={ profile.gender }
                  onChange={ gender => this.setState({ gender }) }
                  error={ error }
                  disabled={ profile.isUpdating }
                  >
                  <option value=""></option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </Picker>


              </div>

              <TextArea
                name="bio"
                label="About you"
                autosize
                rows={ 1 }
                maxLength={ 160 }
                maxRows={ 3 }
                name="bio"
                value={ profile.bio }
                onBlur={ this.submitProfileForm }
                onChange={ bio => this.setState({ bio }) }
                error={ error }
                disabled={ profile.isUpdating }
              />

              <TextField
                type="url"
                placeholder="http://"
                name="website"
                label="Website"
                value={ this.state.website }
                onChange={ website => this.setState({ website }) }
                error={ error }
                disabled={ profile.isUpdating }
              />

              <LocationField
                name="location"
                location={ profile.location }
                label="Your Location"
              />

              <div className="Settings-actions">
                <Button action="primary" disabled={ !this.didChange() || profile.isUpdating }>
                  { profile.isUpdating && 'Updating…' }
                  { this.didChange() && !profile.isUpdating && 'Update profile' }
                  { !this.didChange() && !profile.isUpdating && 'Profile updated' }
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
  profile: state.entities.users[state.session.user],
});

const mapDispatchToProps = dispatch => ({
  updateProfile: data => dispatch(updateProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
