import React from 'react';
import {Link} from 'react-router';

import MessageGroup from '../chat/MessageGroup.jsx';

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
      groups.push([message])
    }
    else {
      groups[groups.length-1].push(message);
    }
    return groups;
  }, [])

}

/**
 * Show the messages belonging to a conversation.
 *
 * @param {Object}  props.conversation
 * @param {String}  props.me
 * @param {Boolean} props.showOnlyLastMessage Show only the last message in the conversation. Set this to true in shout page.
 * @param {Function}  props.onLoadMoreMessagesClick The first argument is the date before which load the messages
 */
export default function MessageList({ conversation, me, showOnlyLastMessage=false, onLoadMoreMessagesClick }) {

  const { messages, id: conversationId } = conversation;
  let loadMore;

  if (showOnlyLastMessage) {
    loadMore = <h5><Link to="messages" params={{ conversationId }}>
      See complete conversation.
    </Link></h5>
  }
  else {

    // TODO: if there are no older messages, do not display the link
    loadMore = <h5 onClick={ (e) => onLoadMoreMessagesClick(messages[0].created_at, e) }>
      Load older messages
    </h5>
  }

  const groups = groupMessages(messages);

  return (
    <div className="MessagesList">
      { loadMore }

      { groups.map( (messages, i) => {
        const isMe = messages[0].user.username === me;
        return (
          <div key={ i } className={ `MessagesList-group${isMe ? ' isMe' : ''}` }>
            <MessageGroup
              messages={ messages }
              showUserImage={ !isMe }
              justify={ isMe ? 'end' : 'start' }
            />
          </div>
        )})
      }
    </div>
  );

}

