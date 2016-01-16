import React from "react";

import MessageItem from "../chat/MessageItem.jsx";
import UserImage from "../user/userImage.jsx";

/**
 * This component shows messages sent by the same user.
 * @param {Array} props.messages
 * @param {Boolean} props.isSentByMe
 */
export default function MessageGroup({ messages, showUserImage, justify="start" }) {

  return (
    <div className={ `MessageGroup ${justify}` }>
      { showUserImage &&
        <div className="MessageGroup-userImage">
          <UserImage image={ messages[0].user.image } />
        </div>
      }
      <div className="MessageGroup-messages">
        { messages.map((message, i) =>
          <MessageItem key={ i } { ...message } justify={ justify } />)
        }
      </div>
    </div>
  );

}
