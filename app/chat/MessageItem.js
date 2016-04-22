import React, { PropTypes } from 'react';
import moment from 'moment';

import ShoutLink from '../shouts/ShoutLink';
import MessageReadByFlag from './MessageReadByFlag';
import ShoutPreview from '../shouts/ShoutPreview';
import GoogleStaticMap from '../location/GoogleStaticMap';
import NewlineToBreak from '../ui/NewlineToBreak';

if (process.env.BROWSER) {
  require('./MessageItem.scss');
}

function MessageAttachment({ attachment }) {
  const { shout, location } = attachment;
  let content;
  if (shout) {
    content = (
      <ShoutLink shout={ shout }>
        <ShoutPreview shout={ shout } thumbnailRatio={ 16 / 9 } showProfile={ false } />
      </ShoutLink>
    );
  }
  if (location) {
    content = <GoogleStaticMap center={ location } markers={[{ ...location }]} />;
  }
  if (!content) {
    return <div className="MessageItem-attachment"></div>;
  }
  return <div className="MessageItem-attachment">{ content }</div>;
}

MessageAttachment.propTypes = {
  attachment: PropTypes.object.isRequired,
};

function MessageFooter({ message, readByProfiles = [] }) {
  const { isCreating, createError, createdAt } = message;
  const created = moment.unix(createdAt);
  return (
    <div className="MessageItem-footer">
      {!isCreating && !createError &&
        <span>
          { readByProfiles.length > 0 && <MessageReadByFlag profiles={ readByProfiles } /> }
        </span>
      }
      {!isCreating && !createError && <span title={created.format('LLLL')}>
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
  const hasAttachments = attachments.length > 0;
  const attachmentsContent = attachments.map((attachment, i) =>
    <MessageAttachment key={ i } attachment={ attachment } />
  );

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
  if (hasAttachments) {
    className += ' has-attachments';
  }

  return (
    <div className={ className }>
      <div className="MessageItem-wrapper">
        { hasAttachments &&
            <div className="MessageItem-attachments">
              { attachmentsContent }
              { !text && <MessageFooter message={ message } /> }
            </div>
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
        <div className="MessageItem-retry" title={createError.message}>
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
