import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';

import { Column, Grid } from '../helper';

import ManyUsersImage from '../user/ManyUsersImage.jsx';

export default function ConversationItem({ conversation, me, selected }) {
  const { users, last_message: lastMessage, about } = conversation;

  const partecipants = users
    .filter(user => user.username !== me)
    .map(user => user.name)
    .join(', ');

  return (
    <Grid
      fluid
      className={ `ConversationItem${selected ? ' isSelected' : ''} `}>
        <Column fluid size={3} clear >
          <ManyUsersImage users={ users.filter(user => user.username !== me) } />
        </Column>

        <Column fluid size={8} >

          { conversation.type === 'about_shout' &&
            <p className="ConversationItem-about">
              <Link to={ `/shout/${about.id}/${about.location.city}/${about.title}` }
                onClick={ e => e.stopPropagation() }>
                {about.title}
              </Link>
            </p>
          }

          <div className="ConversationItem-partecipants">
            { partecipants }
          </div>

          <p className="ConversationItem-lastMessage">
            <Link tabIndex={ -1 } to={ `/chat/${conversation.id}` } onClick={ e => e.stopPropagation() } >
              { lastMessage.text }
            </Link>
          </p>

        </Column>
        <Column fluid size={ 4 }>
          <p className="ConversationItem-createdAt">
            { moment.unix(lastMessage.created_at).calendar() }
          </p>
        </Column>
    </Grid>
  );
}
