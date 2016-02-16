import React from "react";
import { Link } from "react-router";

if (process.env.BROWSER) {
  require("styles/components/UserAvatar.scss");
}

export default function UserAvatar({
  user,
  linkToUserPage=false,
  placeholder=false,  // show placeholder behind the image (default true when user has no image)
  size="medium",     // small, medium, large or huge
  mask               // apply the shoutit logo mask, works only on white backgrounds
}) {

  let className = "UserAvatar";

  if (size) {
    className += ` size-${size}`;
  }

  if (mask) {
    className += ` mask`;
  }

  if (!user.image || placeholder) {
    className += ` placeholder`;
  }

  const avatar = (
    <span className={ className }>
      { user.image && <img src={ user.image } /> }
    </span>
  );

  if (linkToUserPage) {
    return <Link to={ `/user/${user.id}` }>{ avatar }</Link>;
  }

  return avatar;

}
