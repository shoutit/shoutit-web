import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions/session';
import { getLoggedUser } from '../selectors';
if (process.env.BROWSER) {
  require('./HeaderProfileOverlay.scss');
}

export function HeaderProfileOverlay({ user, onLogoutClick, onItemClick }) {
  return (
    <ul className="HeaderProfileOverlay">
      <li>
        <Link onClick={ onItemClick } to={ `/user/${user.username}` }>
          { user.name }
        </Link>
      </li>
      <li className="separe">
        <Link onClick={ onItemClick } to="/settings">
          Settings
        </Link>
      </li>
      <li>
        <Link to="/" onClick={ onLogoutClick }>
          Log out
        </Link>
      </li>
    </ul>
  );
}

HeaderProfileOverlay.propTypes = {
  user: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: getLoggedUser(state),
});

const mapDispatchToProps = dispatch => ({
  onLogoutClick: e => {
    e.preventDefault();
    dispatch(logout()).then(() => window.location.reload());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderProfileOverlay);
