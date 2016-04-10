import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logout } from '../actions/session';

import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

export function HeaderProfileOverlay({ user, onLogoutClick, onItemClick }) {
  return (
    <ul className="htmlNoList">
      <li>
        <Link onClick={ onItemClick } to={`/user/${user.username}`}>
          <ListItem start= { <SVGIcon name="profile" active /> }>
            Your Profile
          </ListItem>
        </Link>
      </li>
      <li>
        <Link onClick={ onItemClick } to="/profile/edit">
          <ListItem start= { <SVGIcon name="pencil" active /> }>
            Edit Account
          </ListItem>
        </Link>
      </li>
      <li>
        <Link to="/logout" onClick={ onLogoutClick }>
          <ListItem start= { <SVGIcon name="exit" active /> }>
            Logout
          </ListItem>
        </Link>
      </li>
    </ul>
  );
}

const mapStateToProps = state => ({
  user: state.session.user,
});

const mapDispatchToProps = dispatch => ({
  onLogoutClick: () => dispatch(logout()).then(() => dispatch(push('/'))),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderProfileOverlay);
