import React from "react";
import { Link } from "react-router";
import SVGIcon from "../helper/SVGIcon";
import NewShoutButton from "../shouting/newShoutButton.jsx";

if (process.env.BROWSER) {
  require("styles/components/HeaderProfile.scss");
}

export default function HeaderProfile({ unreadConversations, onMessagesClick, onProfileClick, onNotificationsClick, loggedUser, flux }) {
  return (
    <div className="HeaderProfile">
      <div>
        <Link to="/messages" onClick={ onMessagesClick }>
          <SVGIcon name="balloon-dots" badge={ unreadConversations } />
        </Link>
      </div>
      <div>
        <SVGIcon name="bell" badge={ 4 } onClick={ onNotificationsClick } />
      </div>
      <div>
        <span className="HeaderProfile-newShout">
          <span><SVGIcon name="sparkle" fill /></span>
          <span>Create Shout</span>
        </span>
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
