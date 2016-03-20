import React from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import FixedHeightPage from "../ui/FixedHeightPage";

import ConversationsTitle from "../chat/ConversationsTitle";
import ConversationsList from "../chat/ConversationsList";

import { denormalize } from "../schemas";

if (process.env.BROWSER) {
  require("./Chat.scss");
}

export function Chat({ params, loggedUser, isFetching, conversations, videoCallState, children }) {

  const unread = conversations.filter(c => c.unreadMessagesCount > 0);

  return (
    <DocumentTitle title="Messages - Shoutit">
      <FixedHeightPage>
        <div className="Chat">
          <div className="Chat-conversations">
            <ConversationsTitle unreadCount={ unread.length } />
            <ConversationsList
              conversations={ conversations }
              selectedId={ params.id }
              isFetching={ isFetching }
              loggedUser={ loggedUser }
            />
          </div>

          <div className="Chat-messages">

            { children ?
              React.cloneElement(children, { loggedUser, videoCallState }) :
              <div className="Chat-placeholder">
                { !isFetching &&
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


const mapStateToProps = state => {
  const { entities } = state;
  const { conversations } = state.pagination;
  const props = {
    loggedUser: state.session.user,
    isFetching: conversations.isFetching,
    conversations: conversations.ids ?
      conversations.ids.map(id =>
        denormalize(entities.conversations[id], entities, "CONVERSATION")
      ) : []
  };
  return props;
};
export default connect(mapStateToProps)(Chat);
