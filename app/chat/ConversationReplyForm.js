import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-textarea-autosize';

// import Button from '../ui/Button';
// import SVGIcon from '../ui/SVGIcon';

import { saveDraft } from '../actions/forms';
import { replyToConversation, replyToShout, notifyTypingUser, chatWithProfile, closeConversation, openConversation } from '../actions/chat';
import { ENTER } from '../utils/keycodes';
import { trimWhitespaces } from '../utils/StringUtils';

if (process.env.BROWSER) {
  require('./ConversationReplyForm.scss');
}

export class ConversationReplyForm extends Component {

  static propTypes = {
    draft: PropTypes.string,
    fields: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    conversation: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    typingTimeout: PropTypes.number,
    focus: PropTypes.bool,
    disabled: PropTypes.bool,
    inputRef: PropTypes.func,
    // onAttachShoutClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    draft: '',
    focus: true,
    disabled: false,
    placeholder: 'Type a message…',
    typingTimeout: 3000,
  }

  componentWillUnmount() {
    if (this.typingTimeout) {
      clearTimeout(this.typingInterval);
      this.typingTimeout = null;
    }
  }

  isTyping = false;
  typingTimeout = null;
  textarea = null;

  createNewConversation(conversation, text) {
    const { dispatch, name } = this.props;

    function onSuccess({ result }) {
      dispatch(closeConversation(conversation.id));
      dispatch(openConversation({ id: result }));
      dispatch(saveDraft(name, { draft: '' }));
    }

    if (conversation.type === 'chat') {
      dispatch(chatWithProfile(conversation, text)).then(onSuccess);
    } else {
      dispatch(replyToShout(conversation, text)).then(onSuccess);
    }
  }

  submit() {
    const { disabled, conversation, dispatch, loggedUser, name } = this.props;
    const text = trimWhitespaces(this.textarea.value);
    if (disabled || !text) {
      return;
    }

    if (conversation.isNew) {
      this.textarea.blur();
      this.createNewConversation(conversation, text);
    } else {
      dispatch(saveDraft(name, { draft: '' }));
      this.textarea.focus();
      dispatch(replyToConversation(conversation.id, loggedUser, { text }));
    }
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
    const { fields, name, conversation, ...attributes } = this.props;
    return (
      <form name={ name }
        className="ConversationReplyForm"
        onSubmit={ e => { e.preventDefault(); this.submit(); } }
      >
        <TextareaAutosize
          { ...attributes }
          ref={ el => {
            this.textarea = el;
            if (this.props.inputRef) {
              this.props.inputRef(el);
            }
          }}
          className="htmlTextarea"
          maxRows={ 5 }
          disabled={ conversation.isCreating }
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
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const name = `conversationReply-${ownProps.conversation.id}`;
  return {
    name,
    loggedUser: state.session.user,
    fields: state.forms[name] || { draft: '' },
  };
};

export default connect(mapStateToProps)(ConversationReplyForm);
