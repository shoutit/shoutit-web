import React, { PropTypes } from 'react';
import moment from 'moment';
import { groupByDay, groupByProfile, getReadyBy } from '../chat/MessagesUtils';
import MessageItem from './MessageItem';
import UserAvatar from '../users/UserAvatar';
if (process.env.BROWSER) {
  require('./MessagesList.scss');
}

export function MessagesByDay({ day, messages, loggedUser, partecipants }) {

  const messagesByUser = groupByProfile(messages)
    .map((byProfile, i) => {
      const { profile, messages: profileMessages } = byProfile;
      let className = 'MessagesList';
      if (profile && profile.isOwner) {
        className += ' is-me';
      }
      return (
        <div key={ i } className={ className }>
          <div className="MessagesList-user">
            { profile && <UserAvatar user={ profile } linkToUserPage tooltip /> }
          </div>
          <div className="MessagesList-messages">
            { profileMessages.map(message =>
              <MessageItem
                key={ message.id }
                message={ message }
                readByProfiles={ message.profile ?
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

MessagesByDay.propTypes = {
  day: PropTypes.string.isRequired,
  messages: PropTypes.array,
  loggedUser: PropTypes.object,
  partecipants: PropTypes.array,
};

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
