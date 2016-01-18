import React from "react";
import moment from "moment";

export default function MessageItem({ created_at, sending, text, justify="start", showDay, sendError }) {
  const createdAt = moment.unix(created_at);
  return (
    <div className={ `MessageItem ${justify}${sendError ? " didError" : ""}`}>
      { showDay && <div className="MessageItem-day">
        { moment.unix(created_at).format("ll") }
      </div> }
      <div className="MessageItem-wrapper">
        <p>
          { text }
        </p>
        <div className="MessageItem-footer">
          {!sending && !sendError &&
            <span title={createdAt.format("LLLL")}>
              { createdAt.format("LT") }
            </span>
          }
          { sending && <span>Sending…</span> }
        </div>
      </div>
      { !sending && sendError &&
        <div className="MessageItem-retry" title={sendError.message}>
          ⚠️ This message could not be sent
        </div>
      }
    </div>
  );
}
