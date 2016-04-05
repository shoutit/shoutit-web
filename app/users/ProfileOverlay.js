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
    const { profile, profile: { cover, location, name, listenersCount } } = this.props;
    return (
      <div className="ProfileOverlay">
        <div className="ProfileOverlay-cover" style={getStyleBackgroundImage(cover)} />
        <div className="ProfileOverlay-user">
          <UserAvatar user={ profile } size="large" />
          <h2>{ name }</h2>
        </div>
        <div className="ProfileOverlay-body">
          { location &&
            <div className="ProfileOverlay-location">
              <span>
                <CountryFlag code={ location.country } size="small" />
              </span>
              { `from ${location.city}` }
            </div>
          }
          <div className="ProfileOverlay-listeners">
            <SVGIcon name="listeners" active={ listenersCount > 0 } /> { listenersCount === 0 ? 'No ' : listenersCount } listener{ listenersCount > 1}s
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
