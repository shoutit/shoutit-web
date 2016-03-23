import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";

import TextareaAutosize from "react-textarea-autosize";
import Button from "../shared/components/helper/Button.jsx";
import SVGIcon from "../shared/components/helper/SVGIcon";
import { saveDraft } from "../actions/forms";
import { replyToConversation } from "../actions/chat";

if (process.env.BROWSER) {
  require("./ConversationReplyForm.scss");
}

export class ConversationReplyForm extends Component {

  static propTypes = {
    draft: PropTypes.string,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    typingTimeout: PropTypes.number,
    onTyping: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired,
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

  handleFormSubmit(e) {
    e.preventDefault();
    const { disabled, conversation, dispatch } = this.props;
    const text = e.target.draft.value.trim();
    if (disabled || !text) {
      return;
    }
    dispatch(replyToConversation(conversation.id, { text }));
    // e.target.draft.value = "";
    // e.target.draft.focus();
  }

  handleTextChange(e) {
    const text = e.target.value;
    const { onTyping, typingTimeout, dispatch, name } = this.props;
    dispatch(saveDraft(name, {draft: text }));

    if (text && onTyping && !this.isTyping) {
      this.isTyping = true;
      onTyping();
      this.typingTimeout = setTimeout(() => {
        onTyping();
        this.isTyping = false;
        clearTimeout(this.typingTimeout);
      }, typingTimeout);
    }
  }

  render() {
    const  { onAttachShoutClick, fields, name, ...attributes } = this.props;
    return (
      <form name={ name } className="ConversationReplyForm" onSubmit={ e => this.handleFormSubmit(e) }>
        <TextareaAutosize
          { ...attributes }
          className="htmlTextarea"
          maxRows={ 5 }
          name="draft"
          value={ fields.draft }
          autoComplete="off"
          onChange={ e => this.handleTextChange(e) }
        />
        <Button leftIcon={ <SVGIcon name="send" fill /> } label="Send" primary type="submit" size="small" disabled={ attributes.disabled } className="reply" />
        <Button label="Attach shout" type="button" size="small" disabled={ attributes.disabled } onClick={ onAttachShoutClick } />
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const name = `conversationReply-${ownProps.conversation.id}`;
  return {
    name,
    fields: state.forms[name] || { draft: "" }
  };
};

export default connect(mapStateToProps)(ConversationReplyForm);
