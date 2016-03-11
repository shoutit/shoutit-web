import React from "react";
import { Link } from "react-router";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { getVariation } from "../utils/APIUtils";

if (process.env.BROWSER) {
  require("./UserAvatar.scss");
}

export default function UserAvatar({
  user={},
  tooltip=false,
  linkToUserPage=false,
  placeholder=false,  // show placeholder behind the image (default true when user has no image)
  size="medium",     // small, medium, large or huge
  mask               // apply the shoutit logo mask, works only on white backgrounds
}) {

  const { image, username, name } = user;

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

  let src;
  if (image) {
    const variation = (size === "small") ? "small" : "medium";
    src = getVariation(image, variation);
  }

  let avatar = (
    <span className={ className }>
      { src && <img alt={ username ? username  : "" } src={ src } /> }
    </span>
  );

  if (linkToUserPage) {
    avatar = <Link to={ `/user/${username}` }>{ avatar }</Link>;
  }

  if (tooltip) {
    avatar = (
      <OverlayTrigger placement="top" overlay={ <Tooltip>{ name }</Tooltip> }>
        { avatar }
      </OverlayTrigger>
    );
  }

  return avatar;

}
