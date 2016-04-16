import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logout } from '../actions/session';

import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

export function HeaderProfilePreview({ user, onLogoutClick, onItemClick }) {
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
        <Link to="/" onClick={ onLogoutClick }>
          <ListItem start= { <SVGIcon name="exit" active /> }>
            Logout
          </ListItem>
        </Link>
      </li>
    </ul>
  );
}

HeaderProfilePreview.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderProfilePreview);
