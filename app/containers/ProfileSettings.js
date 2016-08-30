import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import { connect } from 'react-redux';
import Page, { Body, StartColumn } from '../layout/Page';
import Helmet from '../utils/Helmet';
import RequiresLogin from '../auth/RequiresLogin';

import ProfileAvatarEditable from '../users/ProfileAvatarEditable';
import TextField from '../forms/TextField';
import TextArea from '../forms/TextArea';
import Form from '../forms/Form';
import FieldsGroup from '../forms/FieldsGroup';
import Button from '../forms/Button';
import Picker from '../forms/Picker';
import DatePicker from '../forms/DatePicker';
import LocationField from '../forms/LocationField';
import Panel from '../layout/Panel';

import SettingsNavigation from '../settings/SettingsNavigation';

import { updateProfile } from '../actions/users';
import { getLoggedProfile } from '../reducers/session';

import './Settings.scss';

const MESSAGES = defineMessages({
  title: {
    id: 'profileSettings.page.title',
    defaultMessage: 'Your profile',
  },
  firstNameLabel: {
    id: 'profileSettings.profileForm.firstName.label',
    defaultMessage: 'First Name',
  },
  lastNameLabel: {
    id: 'profileSettings.profileForm.lastName.label',
    defaultMessage: 'Last Name',
  },
  genderLabel: {
    id: 'profileSettings.profileForm.gender.label',
    defaultMessage: 'Gender',
  },
  maleValue: {
    id: 'profileSettings.profileForm.gender.male',
    defaultMessage: 'Male',
  },
  femaleValue: {
    id: 'profileSettings.profileForm.gender.female',
    defaultMessage: 'Female',
  },
  bioLabel: {
    id: 'profileSettings.profileForm.bio.label',
    defaultMessage: 'About You',
  },
  websiteLabel: {
    id: 'profileSettings.profileForm.website.label',
    defaultMessage: 'Website',
  },
  locationLabel: {
    id: 'profileSettings.profileForm.location.label',
    defaultMessage: 'Default Location',
  },
  birthdayLabel: {
    id: 'profileSettings.profileForm.birthday.label',
    defaultMessage: 'Birthday',
  },
  aboutLabel: {
    id: 'profileSettings.profileForm.about.label',
    defaultMessage: 'About',
  },
  nameLabel: {
    id: 'profileSettings.profileForm.name.label',
    defaultMessage: 'Page Name',
  },
  phoneLabel: {
    id: 'profileSettings.profileForm.phone.label',
    defaultMessage: 'Telephone',
  },
});

export class ProfileSettings extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    profile: {},
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      birthday: profile.birthday,
      about: profile.about,
      phone: profile.phone,
      name: profile.name,
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

  handleSubmit(e) {
    e.preventDefault();
    this.updateProfile();
  }

  didChange() {
    const { state } = this;
    const { profile } = this.props;

    return (
      state.first_name !== profile.firstName ||
      state.last_name !== profile.lastName ||
      state.gender !== profile.gender ||
      state.bio !== profile.bio ||
      state.website !== profile.website ||
      state.birthday !== profile.birthday ||
      state.about !== profile.about ||
      state.name !== profile.name ||
      state.phone !== profile.phone
    );
  }

  render() {
    const { profile } = this.props;
    const { formatMessage } = this.props.intl;
    const error = profile.updateError;
    return (
      <RequiresLogin>
        <Page className="Settings">
          <Helmet title={ formatMessage(MESSAGES.title) } appUrl="shoutit://settings" />
          <StartColumn fixed>
            <SettingsNavigation />
          </StartColumn>
          <Body>
            <Panel className="Settings-body">
              <Form onSubmit={ this.handleSubmit }>

                <h2>
                  <FormattedMessage
                    id="profileSettings.profile.formTitle"
                    defaultMessage="Public Profile"
                  />
                </h2>

                <div className="Settings-profile-avatar">
                  <ProfileAvatarEditable profile={ profile } size="huge" />
                </div>

                { profile.type === 'user' &&
                    <FieldsGroup>
                      <TextField
                        flex
                        name="first_name"
                        label={ formatMessage(MESSAGES.firstNameLabel) }
                        value={ profile.firstName }
                        onChange={ first_name => this.setState({ first_name }) }
                        error={ error }
                        disabled={ profile.isUpdating }
                      />
                      <TextField
                        flex
                        name="last_name"
                        label={ formatMessage(MESSAGES.lastNameLabel) }
                        value={ profile.lastName }
                        onChange={ last_name => this.setState({ last_name }) }
                        error={ error }
                        disabled={ profile.isUpdating }
                      />
                      <Picker
                        name="gender"
                        label={ formatMessage(MESSAGES.genderLabel) }
                        value={ profile.gender }
                        onChange={ gender => this.setState({ gender }) }
                        error={ error }
                        disabled={ profile.isUpdating }>
                        <option value="" />
                        <option value="female">
                          { formatMessage(MESSAGES.femaleValue) }
                        </option>
                        <option value="male">
                          { formatMessage(MESSAGES.maleValue) }
                        </option>
                      </Picker>
                    </FieldsGroup>
                }
                { profile.type === 'user' &&
                  <DatePicker
                    flex
                    name="birthday"
                    label={ formatMessage(MESSAGES.birthdayLabel) }
                    value={ profile.birthday }
                    onChange={ birthday => this.setState({ birthday: birthday || null }) }
                    error={ error }
                    disabled={ profile.isUpdating }
                  />
                }
                { profile.type === 'user' &&
                  <TextArea
                    name="bio"
                    label={ formatMessage(MESSAGES.bioLabel) }
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
                }
                { profile.type === 'page' &&
                  <TextField
                    flex
                    name="name"
                    label={ formatMessage(MESSAGES.nameLabel) }
                    value={ profile.name }
                    onChange={ name => this.setState({ name }) }
                    error={ error }
                    disabled={ profile.isUpdating }
                  />
                }
                { profile.type === 'page' &&
                  <TextArea
                    name="about"
                    label={ formatMessage(MESSAGES.aboutLabel) }
                    autosize
                    rows={ 1 }
                    maxLength={ 160 }
                    maxRows={ 3 }
                    name="about"
                    value={ profile.about }
                    onBlur={ this.submitProfileForm }
                    onChange={ about => this.setState({ about }) }
                    error={ error }
                    disabled={ profile.isUpdating }
                  />
                }

                <FieldsGroup>
                  <TextField
                    flex
                    type="url"
                    placeholder="http://"
                    name="website"
                    label={ formatMessage(MESSAGES.websiteLabel) }
                    value={ this.state.website }
                    onChange={ website => this.setState({ website }) }
                    error={ error }
                    disabled={ profile.isUpdating }
                  />
                  {
                    profile.type === 'page' &&
                      <TextField
                        flex
                        type="tel"
                        name="phone"
                        label={ formatMessage(MESSAGES.phoneLabel) }
                        value={ this.state.phone }
                        onChange={ phone => this.setState({ phone }) }
                        error={ error }
                        disabled={ profile.isUpdating }
                      />
                  }
                </FieldsGroup>
                <LocationField
                  name="location"
                  location={ profile.location }
                  label={ formatMessage(MESSAGES.locationLabel) }
                />

                <Button type="submit" kind="primary" disabled={ !this.didChange() || profile.isUpdating }>
                  { profile.isUpdating &&
                    <FormattedMessage id="ProfileSettings.profileForm.updatingLabel" defaultMessage="Updating…" /> }
                  { this.didChange() && !profile.isUpdating &&
                    <FormattedMessage id="ProfileSettings.profileForm.updateLabel" defaultMessage="Update profile" /> }
                  { !this.didChange() && !profile.isUpdating &&
                    <FormattedMessage id="ProfileSettings.profileForm.updatedLabel" defaultMessage="Profile updated" /> }
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
  profile: getLoggedProfile(state),
});

const mapDispatchToProps = dispatch => ({
  updateProfile: data => dispatch(updateProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ProfileSettings));
