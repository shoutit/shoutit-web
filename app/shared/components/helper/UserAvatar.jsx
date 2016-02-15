import React from "react";

if (process.env.BROWSER) {
  require("styles/components/UserAvatar.scss");
}

export default function UserAvatar({ src, size, clip }) {

  let className = "UserAvatar";

  if (size) {
    className += ` size-${className}`;
  }

  if (clip) {
    className += ` clip`;
  }

  return (
    <span className={ className }>
      <img src={ src } />
    </span>
  );

}
