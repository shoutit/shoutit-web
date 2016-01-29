import React from "react";

export default function MessagesTypingUsers({ users }) {
  return (
    <p>
      { users.map(user => user.username).join(", ") }
      { users.length === 1 ? " is " : " are " } typing…
    </p>
  );
}
