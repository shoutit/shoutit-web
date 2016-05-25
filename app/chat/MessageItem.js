import React, { PropTypes } from 'react';
import moment from 'moment';

import MessageAttachment from './MessageAttachment';
import MessageReadByFlag from './MessageReadByFlag';
import NewlineToBreak from '../ui/NewlineToBreak';

if (process.env.BROWSER) {
  require('./MessageItem.scss');
}

function MessageFooter({ message, readByProfiles = [] }) {
  const { isCreating, createError, createdAt } = message;
  const created = moment.unix(createdAt);
  return (
    <div className="MessageItem-footer">
      { !isCreating && !createError &&
        <span>
          { readByProfiles.length > 0 && <MessageReadByFlag profiles={ readByProfiles } /> }
        </span>
      }
      { !isCreating && !createError &&
        <span title={ created.format('LLLL') }>
          { created.format('LT') }
        </span>
      }
      { isCreating && <span>Sending…</span> }
    </div>
  );
}

MessageFooter.propTypes = {
  message: PropTypes.object.isRequired,
  readByProfiles: PropTypes.array,
};

export default function MessageItem({ message, readByProfiles = [] }) {
  const { isCreating, text, createError, attachments = [] } = message;

  let className = 'MessageItem';

  if (message.profile && message.profile.isOwner) {
    className += ' is-me';
  }
  if (createError) {
    className += ' did-error';
  }
  if (isCreating) {
    className += ' sending';
  }
  if (attachments.length > 0) {
    className += ' has-attachments';
  }

  return (
    <div className={ className }>
      <div className="MessageItem-wrapper">
        { attachments.length > 0 &&
          <span className="MessageItem-attachments">
            { attachments.map((attachment, i) =>
              <MessageAttachment key={ i } attachment={ attachment } />
            ) }
            { !text && <MessageFooter message={ message } /> }
          </span>
        }
        { text &&
          <div className="MessageItem-text">
            <p>
              <NewlineToBreak>{ text }</NewlineToBreak>
            </p>
            <MessageFooter message={ message } readByProfiles={ readByProfiles } />
          </div>
        }

      </div>

      { !isCreating && createError &&
        <div className="MessageItem-retry" title={ createError.message }>
          ⚠️ This message could not be sent
        </div>
      }
    </div>
  );
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  readByProfiles: PropTypes.array,
};
