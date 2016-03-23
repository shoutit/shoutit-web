import React from "react";
import moment from "moment";
import { Link } from "react-router";

import MessageReadByFlag from "./MessageReadByFlag";
import ShoutItem from "../shared/components/shout/ShoutItem.jsx";
import GoogleStaticMap from "../shared/components/misc/GoogleStaticMap.jsx";

if (process.env.BROWSER) {
  require("./MessageItem.scss");
}

export default function MessageItem({ message, isMe, readByUsers=[] }) {
  const { createdAt, isCreating, text, createError, attachments=[] } = message;
  const created = moment.unix(createdAt);

  const attachmentsContent = attachments.map((attachment, i) => {
    const { shout, location } = attachment;
    let content;
    if (shout) {
      content = (
        <Link to={ `/shout/${shout.id}` }>
          <ShoutItem outline shout={ shout } thumbnailRatio={ 16/9 } />
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
          { readByUsers.length > 0 && <MessageReadByFlag profiles={ readByUsers } /> }
        </span>
      }
      {!isCreating && !createError && <span title={created.format("LLLL")}>
          { created.format("LT") }
        </span>
      }
      { isCreating && <span>Sending…</span> }
    </div>
  );

  let className = "MessageItem";
  if (isMe) {
    className += " isMe";
  }
  if (createError) {
    className += " didError";
  }
  if (isCreating) {
    className += " sending";
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
            <p> { text } </p>
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
