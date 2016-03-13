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
  const { created_at, sending, text, sendError, attachments=[] } = message;
  const createdAt = moment.unix(created_at);

  const attachmentsContent = attachments.map((attachment, i) => {
    const { shout, location } = attachment;
    let content;
    if (shout) {
      content = (
        <Link to={ `shout/${shout.id}` }>
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
      {!sending && !sendError &&
        <span>
          { readByUsers.length > 0 && <MessageReadByFlag profiles={ readByUsers } /> }
        </span>
      }
      {!sending && !sendError && <span title={createdAt.format("LLLL")}>
          { createdAt.format("LT") }
        </span>
      }
      { sending && <span>Sending…</span> }
    </div>
  );

  let className = "MessageItem";
  if (isMe) {
    className += " isMe";
  }
  if (sendError) {
    className += " didError";
  }
  if (sending) {
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

      { !sending && sendError &&
        <div className="MessageItem-retry" title={sendError.message}>
          ⚠️ This message could not be sent
        </div>
      }
    </div>
  );
}
