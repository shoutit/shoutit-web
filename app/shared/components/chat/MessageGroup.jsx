import React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import {Image, Icon} from '../helper';

import MessageItem from '../chat/MessageItem.jsx';

/**
 * This component shows messages sent by the same user, e.g. the passed `messages `
 * are assumed to have always the same `user`.
 * @param {Array} props.messages
 * @param {Boolean} props.isSentByMe
 */
export default function MessageGroup({ messages, isSentByMe }) {

  const user = messages[0].user;

  const blockClasses = classNames({'from': isSentByMe, 'to': !isSentByMe })
  const imageClasses = classNames({'from-img': isSentByMe, 'to-img': !isSentByMe })
  const msgClasses = classNames({'from-msg': isSentByMe, 'to-msg': !isSentByMe })

  const createdAt = messages[messages.length-1].created_at;

  return (
    <div className={blockClasses}>
      <div className={imageClasses}>
        <Image infix="user" size="small" src={user.image}/>
      </div>
      <div className={msgClasses}>

        { messages.map((message, i) => <MessageItem key={i} message={message} />) }

        { isSentByMe
          ? <Icon className="muichat-to" name="chat-mui1"/>
          : <Icon className="muichat" name="mui-chat"/>
        }
      </div>
    </div>

  );

}
