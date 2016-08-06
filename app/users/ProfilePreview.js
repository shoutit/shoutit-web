import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { backgroundImageStyle } from '../utils/DOMUtils';

import { denormalize } from '../schemas';

import { loadProfileDetailsIfNeeded } from '../actions/users';

import ProfileAvatar from '../users/ProfileAvatar';
import LocationListItem from '../location/LocationListItem';
import ProfileListenersListItem from '../users/ProfileListenersListItem';
import ProfileActions from '../users/ProfileActions';

import './ProfilePreview.scss';

const requiredDetails = ['location', 'listenersCount', 'name', 'cover'];

export class ProfilePreview extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    style: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };
  componentDidMount() {
    const { profile, dispatch } = this.props;
    dispatch(loadProfileDetailsIfNeeded(profile, requiredDetails));
  }
  render() {
    const { profile, style } = this.props;
    return (
      <div className="ProfilePreview" style={ style }>
        <div
          className="ProfilePreview-cover"
          style={ backgroundImageStyle({ url: profile.cover, variation: 'medium' }) }
        />
        <div className="ProfilePreview-user">
          <ProfileAvatar profile={ profile } size="large" />
          <h2>{ profile.name } { profile.isOwner && ' (you)' }</h2>
        </div>
        <div className="ProfilePreview-body">
          { profile.location && <LocationListItem location={ profile.location } size="small" /> }
          <ProfileListenersListItem profile={ profile } size="small" />
        </div>
        <div className="ProfilePreview-actions">
          <ProfileActions showProfileLink profile={ profile } size="small" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  const profile = denormalize(state.entities.users[id], state.entities, 'PROFILE');
  return {
    profile,
  };
};

export default connect(mapStateToProps)(ProfilePreview);
