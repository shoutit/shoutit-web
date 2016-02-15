import React from "react";

if (process.env.BROWSER) {
  require("styles/components/MessagesTypingUsers.scss");
}

export default function MessagesTypingUsers({ users }) {

  let content = "";
  if (users.length > 0) {
    content += users.map(user => user.name).join(", ");
    if (users.length === 1) {
      content += " is typing...";
    }
    else if (users.length > 1) {
      content += " are typing...";
    }
  }

  return (
    <div className="MessagesTypingUsers">
      { content }
    </div>
  );
}
