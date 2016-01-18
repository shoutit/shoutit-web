import React from "react";

import MessageItem from "../chat/MessageItem.jsx";
import UserImage from "../user/userImage.jsx";

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
          <UserImage image={ messages[0].user.image } />
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
