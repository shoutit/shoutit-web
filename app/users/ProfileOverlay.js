import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { getCountryName } from '../utils/LocationUtils';

import { loadProfileDetailsIfNeeded } from '../actions/users';

import UserAvatar from '../users/UserAvatar';

import CountryFlag from '../ui/CountryFlag';
import SVGIcon from '../ui/SVGIcon';
import Button from '../ui/Button';

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
    const { profile } = this.props;
    return (
      <div className="ProfileOverlay">
        <div className="ProfileOverlay-cover" style={getStyleBackgroundImage(profile.cover)} />
        <div className="ProfileOverlay-user">
          <UserAvatar user={ profile } size="large" />
          <h2>{ profile.name }</h2>
        </div>
        <div className="ProfileOverlay-body">
          { profile.location &&
            <div className="ProfileOverlay-location">
              <span>
                <CountryFlag code={ profile.location.country } size="small" />
              </span>
              { `from ${profile.location.city}` }
            </div>
          }
          <div className="ProfileOverlay-listeners">
            <SVGIcon name="listeners" active /> { profile.listenersCount } listener{ profile.listenersCount > 1}s
          </div>
        </div>
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
