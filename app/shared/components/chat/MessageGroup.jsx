import React from "react";

import MessageItem from "../chat/MessageItem.jsx";
import UserAvatar from "../user/UserAvatar.jsx";

if (process.env.BROWSER) {
  require("styles/components/MessageGroup.scss");
}

/**
 * This component shows messages sent by the same user.
 * @param {Array} props.messages
 * @param {Boolean} props.showUserImage
 * @param {String} props.justify "start" or "end"
 */
export default function MessageGroup({ messages, showUserImage, justify="start", dayIndexes=[], onRetryClick }) {

  return (
    <div className={ `MessageGroup ${justify}` }>
      { showUserImage &&
        <div className="MessageGroup-userImage">
          <UserAvatar user={ messages[0].user } linkToUserPage />
        </div>
      }
      <div className="MessageGroup-messages">
        { messages.map((message, i) =>
          <div key={ message.id }>
            <MessageItem
              { ...message }
              onRetryClick={ () => onRetryClick(message) }
              justify={ justify }
              showDay={ dayIndexes.indexOf(i) > -1 }
            />
          </div>
        )}
      </div>
    </div>
  );

}
