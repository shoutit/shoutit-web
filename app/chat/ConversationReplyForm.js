import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";

import TextareaAutosize from "react-textarea-autosize";
import Button from "../shared/components/helper/Button.jsx";
import SVGIcon from "../shared/components/helper/SVGIcon";
import { saveDraft } from "../actions/forms";
import { replyToConversation, notifyTypingUser } from "../actions/chat";
import { ENTER } from "../utils/keycodes";
import { trimWhitespaces } from "../utils/StringUtils";

if (process.env.BROWSER) {
  require("./ConversationReplyForm.scss");
}

export class ConversationReplyForm extends Component {

  static propTypes = {
    draft: PropTypes.string,
    typingTimeout: PropTypes.number,
    onAttachShoutClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    draft: "",
    autoFocus: false,
    disabled: false,
    placeholder: "Type a message…",
    typingTimeout: 3000
  }

  componentWillUnmount() {
    if (this.typingTimeout) {
      clearTimeout(this.typingInterval);
      this.typingTimeout = null;
    }
  }

  isTyping = false;
  typingTimeout = null;

  submit() {
    const { disabled, conversation, dispatch, loggedUser, name } = this.props;
    const text = trimWhitespaces(this.refs.draft.value);
    if (disabled || !text) {
      return;
    }
    dispatch(replyToConversation(conversation.id, loggedUser, { text }));
    dispatch(saveDraft(name, { draft: "" }));
    this.refs.draft.focus();
  }

  handleTextChange(e) {
    const text = e.target.value;
    const { typingTimeout, dispatch, name, loggedUser } = this.props;
    dispatch(saveDraft(name, { draft: text }));

    if (text && !this.isTyping) {
      this.isTyping = true;
      dispatch(notifyTypingUser(loggedUser));
      this.typingTimeout = setTimeout(() => {
        dispatch(notifyTypingUser(loggedUser));
        this.isTyping = false;
        clearTimeout(this.typingTimeout);
      }, typingTimeout);
    }
  }

  render() {
    const  { onAttachShoutClick, fields, name, ...attributes } = this.props;
    return (
      <form name={ name }
        className="ConversationReplyForm"
        onSubmit={ e => { e.preventDefault(); this.submit(); } }
      >
        <TextareaAutosize
          { ...attributes }
          ref="draft"
          className="htmlTextarea"
          maxRows={ 5 }
          name="draft"
          value={ fields.draft }
          autoComplete="off"
          onKeyDown={ e => {
            if (e.keyCode === ENTER && !e.shiftKey) {
              e.preventDefault();
              this.submit();
            }
          }}
          onChange={ e => this.handleTextChange(e) }
        />
        <Button leftIcon={ <SVGIcon name="send" fill /> } label="Send" primary type="submit" size="small" disabled={ attributes.disabled || !trimWhitespaces(fields.draft) } className="reply" />
        <Button label="Attach shout" type="button" size="small" disabled={ attributes.disabled } onClick={ onAttachShoutClick } />
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const name = `conversationReply-${ownProps.conversation.id}`;
  return {
    name,
    loggedUser: state.session.user,
    fields: state.forms[name] || { draft: "" }
  };
};

export default connect(mapStateToProps)(ConversationReplyForm);
