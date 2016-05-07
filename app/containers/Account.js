import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';
import Helmet from '../utils/Helmet';
import RequiresLogin from '../auth/RequiresLogin';

import ProfileAvatarEditable from '../users/ProfileAvatarEditable';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Picker from '../ui/Picker';
import LocationField from '../ui/LocationField';
import { updateProfile } from '../actions/users';

if (process.env.BROWSER) {
  require('./Account.scss');
}
export class Account extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.submitProfileForm = this.submitProfileForm.bind(this);
    const { profile } = props;
    this.state = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
      bio: profile.bio,
      about: profile.about,
      website: profile.website,
    };
  }

  submitProfileForm() {
    const { id } = this.props.profile;
    this.props.updateProfile({ id, ...this.state });
  }

  handleFieldChange(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    // const { profileData, accountData, didProfileDataChange } = this.state;
    const { profile } = this.props;

    const didProfileDataChange = this.state.firstName !== profile.firstName ||
      this.state.lastName !== profile.lastName ||
      this.state.gender !== profile.gender ||
      this.state.bio !== profile.bio ||
      this.state.website !== profile.website;


    return (
      <RequiresLogin>
        <Page className="Account">
          <Helmet title="Your account" />

          <h1>Your account</h1>

          <div className="Account-layout">

            <div>
              <form onSubmit={ e => { e.preventDefault(); this.submitProfileForm(); } } ref="profileForm">
                <div className="Account-profile">
                  <div className="Account-profile-avatar">
                    <ProfileAvatarEditable profile={ profile } size="huge" />
                  </div>

                  <div className="Account-profile-fields">

                    <h2>Profile</h2>

                    <div className="Account-profile-name">

                      <TextField
                        ref="firstName"
                        name="first_name"
                        label="First Name"
                        defaultValue={ profile.firstName }
                        onBlur={ this.submitProfileForm }
                        onChange={ firstName => this.setState({ firstName }) }
                      />

                      <TextField
                        ref="lastName"
                        name="last_name"
                        label="Last Name"
                        defaultValue={ profile.lastName }
                        onBlur={ this.submitProfileForm }
                        onChange={ lastName => this.setState({ lastName }) }
                      />

                      <Picker
                        name="gender"
                        ref="gender"
                        label="Gender"
                        defaultValue={ profile.gender }
                        onBlur={ this.submitProfileForm }
                        onChange={ gender => this.setState({ gender }, this.submitProfileForm) }
                        >
                        <option value=""></option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                      </Picker>


                    </div>

                    <TextField
                      ref="bio"
                      name="bio"
                      label="Short bio"
                      defaultValue={ profile.bio }
                      onBlur={ this.submitProfileForm }
                      onChange={ bio => this.setState({ bio }) }
                    />

                    <TextArea
                      ref="about"
                      name="about"
                      label="About you"
                      autosize
                      rows={ 2 }
                      maxRows={ 10 }
                      name="about"
                      defaultValue={ profile.about }
                      onBlur={ this.submitProfileForm }
                      onChange={ about => this.setState({ about }) }
                    />

                    <TextField
                      ref="website"
                      name="website"
                      label="Website"
                      defaultValue={ profile.website }
                      onBlur={ this.submitProfileForm }
                      onChange={ website => this.setState({ website }) }
                    />

                    <LocationField
                      name="location"
                      location={ profile.location }
                      label="Your Location"
                    />

                    <div className="Account-actions">
                      <Button action="primary" disabled={ !didProfileDataChange || profile.isUpdating }>
                        { didProfileDataChange && profile.isUpdating ? 'Saving…' : 'Save changes' }
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

            </div>

            <div>
              <form>
                <h2>Account details</h2>

                <TextField block name="username" label="Username" defaultValue={ profile.username } />
                <TextField block name="email" label="E-mail" defaultValue={ profile.email } />
                <TextField block name="mobile" label="Mobile" defaultValue={ profile.mobile } />

                <h3>Change password</h3>

                <div className="Account-main-password">
                  <TextField name="password" placeholder="New password" type="password" />
                  <TextField name="password_2" placeholder="Repeat the new password" type="password" />
                </div>

                <div className="Account-actions">
                  <Button action="primary">Save changes</Button>
                </div>
              </form>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Account);
