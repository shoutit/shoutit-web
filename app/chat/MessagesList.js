import React, { PropTypes } from 'react';
import moment from 'moment';
import { groupByDay, groupByProfile, getReadyBy } from '../chat/MessagesUtils';
import MessageItem from './MessageItem';
import ProfileAvatar from '../users/ProfileAvatar';
if (process.env.BROWSER) {
  require('./MessagesList.scss');
}

export function MessagesByDay({ day, messages, partecipants }) {

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
            { profile && <ProfileAvatar profile={ profile } linkToProfilePage tooltip /> }
          </div>
          <div className="MessagesList-messages">
            { profileMessages.map(message =>
              <MessageItem
                key={ message.id }
                message={ message }
                readByProfiles={ message.profile ?
                  getReadyBy(message, partecipants) :
                  undefined
                }
              />
            ) }
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
  partecipants: PropTypes.array,
};

export default function MessagesList({ messages, partecipants }) {
  return (
    <div>
      { groupByDay(messages).map((group, i) =>
        <MessagesByDay
          key={ i }
          day={ group.day }
          messages={ group.messages }
          partecipants={ partecipants }
        />
      ) }
    </div>
  );
}

MessagesList.propTypes = {
  messages: React.PropTypes.array,
  partecipants: React.PropTypes.array,
};
