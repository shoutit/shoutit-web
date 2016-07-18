/* eslint-env browser */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/session';
import { getLoggedUser } from '../../reducers/session';

import './ProfileOverlay.scss';

export function ProfileOverlay({ profile, onLogoutClick, onItemClick }) {
  return (
    <ul className="ProfileOverlay">
      <li>
        <Link onClick={ onItemClick } to={ `/user/${profile.username}` }>
          <FormattedMessage
            id="header.profilePopover.menu.profile"
            defaultMessage="{name}"
            values={ { ...profile } }
          />
        </Link>
      </li>
      <li className="separe">
        <Link onClick={ onItemClick } to="/settings">
          <FormattedMessage
            id="header.profilePopover.menu.setting"
            defaultMessage="Settings"
          />
        </Link>
      </li>
      <li>
        <Link to="/" onClick={ onLogoutClick }>
          <FormattedMessage
            id="header.profilePopover.menu.logout"
            defaultMessage="Logout"
          />
        </Link>
      </li>
    </ul>
  );
}

ProfileOverlay.propTypes = {
  profile: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: getLoggedUser(state),
});

const mapDispatchToProps = dispatch => ({
  onLogoutClick: e => {
    e.preventDefault();
    dispatch(logout()).then(() => window.location.reload());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileOverlay);