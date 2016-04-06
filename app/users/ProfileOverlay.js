import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getStyleBackgroundImage } from '../utils/DOMUtils';

import { loadProfileDetailsIfNeeded } from '../actions/users';

import UserAvatar from '../users/UserAvatar';
import ProfileFromListItem from '../users/ProfileFromListItem';
import ProfileListenersListItem from '../users/ProfileListenersListItem';
import ProfileActions from '../users/ProfileActions';

if (process.env.BROWSER) {
  require('./ProfileOverlay.scss');
}

export class ProfileOverlay extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
  };
  componentDidMount() {
    const { profile, dispatch } = this.props;
    dispatch(loadProfileDetailsIfNeeded(profile, ['location', 'listenersCount']));
  }
  render() {
    const { profile, profile: { cover, name } } = this.props;
    return (
      <div className="ProfileOverlay">
        <div className="ProfileOverlay-cover" style={getStyleBackgroundImage(cover)} />
        <div className="ProfileOverlay-user">
          <UserAvatar user={ profile } size="large" />
          <h2>{ name }</h2>
        </div>
        <div className="ProfileOverlay-body">
          <ProfileFromListItem profile={ profile } size="small" />
          <ProfileListenersListItem profile={ profile } size="small" />
        </div>
        { !profile.isOwner &&
          <div className="ProfileOverlay-actions">
            <ProfileActions showProfileLink profile={ profile } size="small" />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  const profile = state.entities.users[id];
  return {
    profile,
  };
};

export default connect(mapStateToProps)(ProfileOverlay);
