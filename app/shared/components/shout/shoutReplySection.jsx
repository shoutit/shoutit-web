import React from 'react';
import {Link} from 'react-router';
import {Col} from 'react-bootstrap';

import ReplyInput from '../../../chat/MessageReplyForm';
import MessagesList from '../../../chat/MessagesList';

export default React.createClass({
  displayName: "ShoutReplySection",

  propTypes: {
    shout: React.PropTypes.object,
    user: React.PropTypes.string,
    onReplyTextChange: React.PropTypes.func,
    onReplySendClicked: React.PropTypes.func,
    replyDrafts: React.PropTypes.object
  },

  render() {
    let content;
    let shout = this.props.shout,
      user = this.props.user;

    if (shout && shout.id) {
      if (user) {
        if (user !== shout.user.username) {
          let draft = this.props.replyDrafts[shout.id];

          content = (
            <div>
              <h4>Reply to the creator</h4>
              <ReplyInput
                onTextChange={this.props.onReplyTextChange}
                onReplyClicked={this.props.onReplySendClicked}
                text={draft ? draft.text : ""}
                />
            </div>
          );
        } else {
          if (shout.conversations) {
            let conversationList = shout.conversations.length ? shout.conversations.map((conversation, i) => (
              <MessagesList key={"shout-con-" + i}
                       conversation={ conversation }
                       me={user}
                       showOnlyLastMessage />
            )) : (
              <h5>Nobody replied yet!</h5>
            );

            content = (
              <div>
                <h4>Replies</h4>
                {conversationList}
              </div>
            );
          } else {
            content = (
              <h4>Nobody replied yet!</h4>
            );
          }
        }
      } else {
        content = (
          <h4>
            <Link to="login">Log in</Link> to reply to this shout.
          </h4>
        );
      }
    }

    return (
      <Col xs={12} md={12} className="section-12 replySection">
        {content}
      </Col>
    );
  }
});
