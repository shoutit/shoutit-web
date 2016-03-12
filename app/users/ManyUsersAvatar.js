import React from "react";
import UserAvatar from "./UserAvatar";

export default function ManyUsersAvatar({ users, size=40, max=4, columns=2 }) {
  const containerStyle = {
    width: `${size}px`
  };
  const imgStyle = {
    borderRadius: "100%",
    display: "inline-block"
  };
  switch (users.length) {
  case 1:
    imgStyle.width = `${size}px`;
    imgStyle.height = `${size}px`;
    break;
  default:
    imgStyle.float = "left";
    imgStyle.width = `${size/columns}px`;
    imgStyle.height = `${size/columns}px`;
  }

  return (
    <div style={ containerStyle }>
      { users.slice(0, max).map(user =>
        <UserAvatar key={user.id} user={ user } size={ users.length === 1 ? "medium" : "small" }/>
      )}
    </div>
  );
}
