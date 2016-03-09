import React from "react";
import moment from "moment";
import { Link } from "react-router";

import ShoutItem from "../shared/components/shout/ShoutItem";
import GoogleStaticMap from "../shared/components/misc/GoogleStaticMap";

if (process.env.BROWSER) {
  require("./MessageItem.scss");
}

export default function MessageItem({ created_at, sending, text, justify="start", showDay, sendError, attachments=[] }) {
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
        <span title={createdAt.format("LLLL")}>
          { createdAt.format("LT") }
        </span>
      }
      { sending && <span>Sending…</span> }
    </div>
  );

  const className = `MessageItem ${justify}${sendError ? " didError" : ""}`;

  return (
    <div className={ className }>
      { showDay && <div className="MessageItem-day">
        { moment.unix(created_at).format("ll") }
      </div> }

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
