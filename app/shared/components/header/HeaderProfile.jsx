import React from "react";
import { Link } from "react-router";
import SVGIcon from "../helper/SVGIcon";
import Button from "../helper/Button.jsx";

if (process.env.BROWSER) {
  require("styles/components/HeaderProfile.scss");
}

export default function HeaderProfile({
  unreadCount,
  loggedUser,
  onMessagesClick,
  onProfileClick,
  onNotificationsClick,
  onNewShoutClick
}) {
  return (
    <div className="HeaderProfile">
      <div>
        <Link to="/messages" onClick={ onMessagesClick }>
          <SVGIcon name="balloon-dots" badge={ unreadCount } />
        </Link>
      </div>
      <div>
        <SVGIcon name="bell" badge={ 0 } onClick={ onNotificationsClick } />
      </div>
      <div>
        <Button
          primary
          size="small"
          label="Create Shout"
          onClick={ onNewShoutClick }
          leftIcon={ <SVGIcon name="sparkle" fill /> } />
      </div>
      <div>
          <Link
            className="HeaderProfile-profileLink"
            to={`/user/${loggedUser.username}`}
            onClick={ onProfileClick }>
              <div className="HeaderProfile-image">
                <img src={ loggedUser.image } />
              </div>
          </Link>
      </div>
    </div>
  );
}
