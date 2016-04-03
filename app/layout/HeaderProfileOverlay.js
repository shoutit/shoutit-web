import React from 'react';
import { Link } from 'react-router';

import SVGIcon from '../ui/SVGIcon';

if (process.env.BROWSER) {
  require('styles/components/HeaderProfileOverlay.scss');
}

export default function HeaderProfileOverlay({ loggedUser, onLogoutClick }) {
  return (
    <ul className="HeaderProfileOverlay">
      <li>
        <Link to={`/user/${loggedUser.username}`}>
          <SVGIcon name="profile" active />My Profile
        </Link>
      </li>
      <li>
        <Link to={`/user/${loggedUser.username}`} query={ { _edit: 1 } }>
          <SVGIcon name="pencil" active />Edit Profile
        </Link>
      </li>
      {/* <li>
        <Link to="/settings">
          <SVGIcon name="cog" active />Settings
        </Link>
      </li>*/}
      <li>
        <Link to="/logout" className="item" onClick={ e => {
          e.preventDefault();
          onLogoutClick(e);
        }}>
          <SVGIcon name="exit" active />Logout
        </Link>
      </li>
    </ul>
  );
}
