import React from "react";
import moment from "moment";

import MessageGroup from "./MessageGroup";
import MessagesTypingUsers from "./MessagesTypingUsers";

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
export default function MessageList({ messages, me, partecipants, onRetryClick, typingUsers=[] }) {
  const groups = groupMessages(messages);

  const readByMessages = {};

  if (partecipants) {
    messages.forEach(message => {
      if (!message.read_by) {
        return;
      }
      readByMessages[message.id] = message.read_by.map(readBy =>
        partecipants.find(partecipant => partecipant.id === readBy.profile_id)
      )
      .filter(profile => profile.username !== me)
      .filter(profile => profile.id !== message.user.id);
    });
  }

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
              readByMessages={ readByMessages }
              showUserImage={ messages[0].user && !isMe }
              justify={ isMe ? "end" : "start" }
            />
          </div>
        );})
      }

      <MessagesTypingUsers users={ typingUsers } />

    </div>
  );

}
