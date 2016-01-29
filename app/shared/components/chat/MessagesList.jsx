import React from "react";
import moment from "moment";

import MessageGroup from "../chat/MessageGroup.jsx";
import MessagesTypingUsers from "../chat/MessagesTypingUsers.jsx";

/**
 * Return an array of messages grouped by its username
 * TODO: move in some Utils so this can be tested
 * @param  {Array} messages
 * @return {Array}
 */
function groupMessages(messages) {
  return messages.reduce((groups, message, i, messages) => {

    const isNewBlock = i === 0 ||
      !message.user || !messages[i-1].user || // consider if user left conversation
      messages[i-1].user.username !== message.user.username;

    const shouldDisplayDay = i === 0 ||
      !moment.unix(messages[i - 1].created_at).isSame(moment.unix(message.created_at), "day");

    if (isNewBlock) {
      const group = {
        messages: [message],
        dayIndexes: shouldDisplayDay ? [0] : []
      };
      groups.push(group);
    }
    else {
      const group = groups[groups.length-1];
      group.messages.push(message);
      if (shouldDisplayDay) {
        group.dayIndexes.push(group.messages.length - 1);
      }
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
export default function MessageList({ messages, me, onRetryClick, typingUsers=[] }) {
  const groups = groupMessages(messages);
  return (
    <div>

      { groups.map( group => {
        const { messages, dayIndexes } = group;
        const isMe = messages[0].user && messages[0].user.username === me;
        const className = `MessagesList-group${isMe ? " isMe" : ""}`;
        return (
          <div key={ messages[0].id } className={ className }>
            <MessageGroup
              onRetryClick={ onRetryClick }
              dayIndexes={ dayIndexes }
              messages={ messages }
              showUserImage={ messages[0].user && !isMe }
              justify={ isMe ? "end" : "start" }
            />
          </div>
        );})
      }

      { typingUsers.length > 0 && <MessagesTypingUsers users={ typingUsers } /> }

    </div>
  );

}
