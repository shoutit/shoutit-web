import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import MessageReadByFlag from './MessageReadByFlag';
import ShoutPreview from '../shouts/ShoutPreview';
import GoogleStaticMap from '../location/GoogleStaticMap';
import NewlineToBreak from '../ui/NewlineToBreak';

if (process.env.BROWSER) {
  require('./MessageItem.scss');
}

export default function MessageItem({ message, readByProfiles = [] }) {
  const { createdAt, isCreating, text, createError, attachments = [] } = message;
  const created = moment.unix(createdAt);
  const attachmentsContent = attachments.map((attachment, i) => {
    const { shout, location } = attachment;
    let content;
    if (shout) {
      content = (
        <Link to={ `/shout/${shout.id}` }>
          <ShoutPreview shout={ shout } thumbnailRatio={ 16 / 9 } />
        </Link>
      );
    }
    if (location) {
      content = <GoogleStaticMap center={ location } markers={[{ ...location }]} />;
    }
    if (!content) {
      return null;
    }
    return <div key={ i } className="MessageItem-attachment">{ content }</div>;
  });
  const footer = (
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

  return (
    <div className={ className }>
      <div className="MessageItem-wrapper">
        { attachmentsContent.length > 0 &&
            <div className="MessageItem-attachments">
              { attachmentsContent }
              { !text && footer }
            </div>
        }
        { text &&
          <div className="MessageItem-text">
            <p>
              <NewlineToBreak>{ text }</NewlineToBreak>
            </p>
            { footer }
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
