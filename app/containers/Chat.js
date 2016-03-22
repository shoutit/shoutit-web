import React from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import FixedHeightPage from "../ui/FixedHeightPage";

import ConversationsTitle from "../chat/ConversationsTitle";
import ConversationsList from "../chat/ConversationsList";
import { loadConversations } from "../actions/chat";
import RequiresLogin from "../auth/RequiresLogin";

import { denormalize } from "../schemas";

if (process.env.BROWSER) {
  require("./Chat.scss");
}

export class Chat extends React.Component {

  componentDidMount() {
    if (this.props.loggedUser) {
      this.props.dispatch(loadConversations());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedUser && !this.props.loggedUser) {
      this.props.dispatch(loadConversations());
    }
  }

  render() {
    const { params, loggedUser, isFetching, conversations, videoCallState, children } = this.props;
    const unread = conversations.filter(c => c.unreadMessagesCount > 0);
    return (
      <RequiresLogin>
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
                    { conversations.length > 0 ?
                        "Please pick a conversation" :
                        isFetching ? "Loading..." :
                        "No messages."
                      }
                  </div>
                }
              </div>

            </div>
          </FixedHeightPage>
        </DocumentTitle>
      </RequiresLogin>
    );
  }
}

const mapStateToProps = state => {
  const { entities, chat } = state;
  const props = {
    loggedUser: state.session.user,
    isFetching: chat.isFetching,
    conversations: chat.ids ?
      chat.ids.map(id =>
        denormalize(entities.conversations[id], entities, "CONVERSATION")
      ) : []
  };
  return props;
};
export default connect(mapStateToProps)(Chat);
