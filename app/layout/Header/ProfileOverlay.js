/* eslint-env browser */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SwitchToPageModal from '../../users/SwitchToPageModal';

import { openModal } from '../../actions/ui';
import { getLoggedProfile, getLoggedAccount } from '../../reducers/session';
import { cancelAuthentication } from '../../actions/session';

import './ProfileOverlay.scss';

export function ProfileOverlay({ profile, account, closeOverlay, onSwitchToPageClick, onCancelAuthenticationClick }) {
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
        { profile.username !== account.username ?
          <a onClick={ onCancelAuthenticationClick }>
            <FormattedMessage
              id="header.profilePopover.menu.switchToAccount"
              defaultMessage="Use as {name}"
              values={ account }
            />
          </a> :
          <a onClick={ onSwitchToPageClick }>
            <FormattedMessage
              id="header.profilePopover.menu.switchToPage"
              defaultMessage="Use as Page…"
            />
          </a>
        }
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
        <a href="/logout">
          <FormattedMessage
            id="header.profilePopover.menu.logout"
            defaultMessage="Logout"
          />
        </a>
      </li>
    </ul>
  );
}

ProfileOverlay.propTypes = {
  profile: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  closeOverlay: PropTypes.func.isRequired,
  onSwitchToPageClick: PropTypes.func.isRequired,
  onCancelAuthenticationClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: getLoggedProfile(state),
  account: getLoggedAccount(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSwitchToPageClick: () => {
    ownProps.closeOverlay();
    dispatch(openModal(<SwitchToPageModal />));
  },
  onCancelAuthenticationClick: () => {
    dispatch(cancelAuthentication()).then(() => window.location = '/');
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileOverlay);
