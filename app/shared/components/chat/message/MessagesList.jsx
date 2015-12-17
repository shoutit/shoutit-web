import React from 'react';
import {Link} from 'react-router';

import MessageGroup from './MessageGroup.jsx';

/**
 * Return an array of messages grouped by its username
 * TODO: move in some Utils so this can be tested
 * @param  {Array} messages
 * @return {Array}
 */
function groupMessages(messages) {
  return messages.reduce((blocks, message, i, messages) => {
    const isNewBlock = i === 0 || messages[i-1].user.username !== message.user.username;
    if (isNewBlock) {
      blocks.push([message])
    }
    else {
      blocks[blocks.length-1].push(message);
    }
    return blocks;
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
    loadMore = <h5 onClick={ (e) => onLoadMoreMessagesClick(messages[0].created_at, e) }>
      Load older messages
    </h5>
  }

  const groups = groupMessages(messages);

  return (
    <div className="cnt-chat">
      { loadMore }

      { groups.map( (messages, i) =>
          <MessageGroup
            key={ i }
            messages={ messages }
            isSentByMe={ messages[0].user.username === me }
          />
        )
      }
    </div>
  );

}

