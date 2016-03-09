import React from "react";
import DocumentTitle from "react-document-title";

import FixedHeightPage from "../ui/FixedHeightPage";

import ConversationsTitle from "../chat/ConversationsTitle";
import ConversationsList from "../chat/ConversationsList";

if (process.env.BROWSER) {
  require("./Chat.scss");
}

export default function Chat({ params, loggedUser, chat, conversations, videoCallState, children }) {

  const unread = conversations.filter(c => c.unread_messages_count > 0);

  return (
    <DocumentTitle title="Messages - Shoutit">
      <FixedHeightPage>
        <div className="Chat">
          <div className="Chat-conversations">
            <ConversationsTitle unreadCount={ unread.length } />
            <ConversationsList
              conversations={ conversations }
              selectedId={ params.id }
              loading={ chat.loading }
              loggedUser={ loggedUser }
            />
          </div>

          <div className="Chat-messages">

            { children ?
              React.cloneElement(children, { loggedUser, videoCallState }) :
              <div className="Chat-placeholder">
                { !chat.loading &&
                  conversations.length > 0 ?
                    "Please pick a conversation." :
                    "No messages, yet!"
                }
              </div>
            }
          </div>

        </div>
      </FixedHeightPage>
    </DocumentTitle>
  );
}
