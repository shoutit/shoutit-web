import React from 'react';
import moment from 'moment';
import { groupByDay, groupByUser, getReadyBy } from '../chat/MessagesUtils';
import MessageItem from './MessageItem';
import UserAvatar from '../users/UserAvatar';
if (process.env.BROWSER) {
  require('./MessagesList.scss');
}

function MessagesByDay({ day, messages, loggedUser, partecipants }) {
  const messagesByUser = groupByUser(messages)
    .map((byUser, i) => {
      const { user, messages: userMessages } = byUser;
      const isMe = user && user.username === loggedUser.username;
      let className = 'MessagesList';
      if (isMe) {
        className += ' isMe';
      }
      return (
        <div key={ i } className={ className }>
          <div className="MessagesList-user">
            { user && <UserAvatar user={ user } linkToUserPage tooltip /> }
          </div>
          <div className="MessagesList-messages">
            { userMessages.map(message =>
              <MessageItem
                key={ message.id }
                message={ message }
                isMe={ isMe }
                readByUsers={ message.user ?
                  getReadyBy(message, partecipants, loggedUser.username) :
                  undefined
                }
              />
            )}
          </div>
        </div>
      );
    });

  return (
    <div>
      <div className="MessagesList-day">
        <span /><span>{ moment(day).format('ll') }</span><span />
      </div>
      { messagesByUser }
    </div>
  );
}

export default function MessagesList({ messages, loggedUser, partecipants }) {
  return (
    <div>
        { groupByDay(messages).map((group, i) =>
          <MessagesByDay
            key={i}
            day={ group.day }
            loggedUser={ loggedUser }
            messages={ group.messages }
            partecipants={ partecipants }
          />
        )}
    </div>
  );
}
MessagesList.propTypes = {
  messages: React.PropTypes.array,
  loggedUser: React.PropTypes.object,
  partecipants: React.PropTypes.array,
};
