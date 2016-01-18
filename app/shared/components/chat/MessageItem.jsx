import React from "react";
import moment from "moment";

export default function MessageItem({ created_at, sending, text, justify="start", showDay }) {
  const createdAt = moment.unix(created_at);
  return (
    <div className={ `MessageItem ${justify}`}>
      { showDay && <div className="MessageItem-day">
        { moment.unix(created_at).format("ll") }
      </div> }
      <div className="MessageItem-wrapper">
        <p>
          { text }
        </p>
        <div className="MessageItem-createdAt" title={createdAt.format("LLLL")}>
          { createdAt.format("LT") }
        </div>
        { sending && <p>sending...</p> }
      </div>
    </div>
  );
}
