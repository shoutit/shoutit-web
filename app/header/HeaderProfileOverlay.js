import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions/session';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

export function HeaderProfileOverlay({ user, onLogoutClick, onItemClick }) {
  return (
    <ul className="htmlNoList">
      <li>
        <Link onClick={ onItemClick } to={`/user/${user.username}`}>
          <ListItem start= { <Icon name="profile" active /> }>
            Your Profile
          </ListItem>
        </Link>
      </li>
      {/*<li>
        <Link onClick={ onItemClick } to="/profile/edit">
          <ListItem start= { <Icon name="pencil" active /> }>
            Edit Account
          </ListItem>
        </Link>
      </li>*/}
      <li>
        <Link to="/" onClick={ onLogoutClick }>
          <ListItem start= { <Icon name="exit" active /> }>
            Logout
          </ListItem>
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
  user: state.session.user,
});

const mapDispatchToProps = dispatch => ({
  onLogoutClick: e => {
    e.preventDefault();
    dispatch(logout()).then(() => window.location.reload());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderProfileOverlay);
