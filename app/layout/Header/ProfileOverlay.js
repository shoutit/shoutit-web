/* eslint-env browser */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SwitchToPageModal from '../../users/SwitchToPageModal';

import { logout } from '../../actions/session';
import { openModal } from '../../actions/ui';
import { getLoggedUser } from '../../reducers/session';

import './ProfileOverlay.scss';

export function ProfileOverlay({ profile, onLogoutClick, closeOverlay, onSwitchToPageClick }) {
  return (
    <ul className="ProfileOverlay">
      <li>
        <Link onClick={ closeOverlay } to={ `/user/${profile.username}` }>
          <FormattedMessage
            id="header.profilePopover.menu.profile"
            defaultMessage="{name}"
            values={ { ...profile } }
          />
        </Link>
      </li>
      <li>
        <a onClick={ onSwitchToPageClick }>
          <FormattedMessage
            id="header.profilePopover.menu.switchToPage"
            defaultMessage="Use as Page…"
          />
        </a>
      </li>
      <li className="separe">
        <Link onClick={ closeOverlay } to="/settings">
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
  closeOverlay: PropTypes.func.isRequired,
  onSwitchToPageClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: getLoggedUser(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLogoutClick: e => {
    e.preventDefault();
    dispatch(logout()).then(() => window.location.reload());
  },
  onSwitchToPageClick: () => {
    ownProps.closeOverlay();
    dispatch(openModal(<SwitchToPageModal />));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileOverlay);
