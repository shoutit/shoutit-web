import React from "react";
import { formatCreatedAt } from "../../../utils/DateUtils";

export default function MessageItem({ created_at, sending, text, justify="start" }) {

  return (
    <div className={ `MessageItem ${justify}`}>
      <div className="MessageItem-wrapper">
        <div>
          { text }
        </div>
        <div className="MessageItem-createdAt">
          { formatCreatedAt(created_at) }
        </div>
        { sending && <p>sending...</p> }
      </div>
    </div>
  );
}
