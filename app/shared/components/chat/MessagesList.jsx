import React from "react";

import MessageGroup from "../chat/MessageGroup.jsx";

/**
 * Return an array of messages grouped by its username
 * TODO: move in some Utils so this can be tested
 * @param  {Array} messages
 * @return {Array}
 */
function groupMessages(messages) {
  return messages.reduce((groups, message, i, messages) => {
    const isNewBlock = i === 0 || messages[i-1].user.username !== message.user.username;
    if (isNewBlock) {
      groups.push([message]);
    }
    else {
      groups[groups.length-1].push(message);
    }
    return groups;
  }, []);

}

/**
 * Show the messages belonging to a conversation.
 *
 * @param {Array}  props.messages
 * @param {String}  props.me
 */
export default function MessageList({ messages, me }) {
  const groups = groupMessages(messages);

  return (
    <div className="MessagesList">

      { groups.map( (messages, i) => {
        const isMe = messages[0].user.username === me;
        return (
          <div key={ i } className={ `MessagesList-group${isMe ? " isMe" : ""}` }>
            <MessageGroup
              messages={ messages }
              showUserImage={ !isMe }
              justify={ isMe ? "end" : "start" }
            />
          </div>
        );})
      }
    </div>
  );

}
