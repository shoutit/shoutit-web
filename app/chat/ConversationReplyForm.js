import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import trim from 'lodash/trim';

import TextareaAutosize from 'react-textarea-autosize';

import { saveDraft } from '../actions/forms';

import { replyToConversation, closeConversation, openConversation } from '../actions/conversations';

import { notifyTypingUser } from '../actions/chat';
import { chatWithProfile } from '../actions/users';
import { replyToShout } from '../actions/shouts';

import { ENTER } from '../utils/keycodes';
import { getLoggedUser } from '../selectors';

import ReplyFormToolbar from '../chat/ReplyFormToolbar';

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
  };

  static defaultProps = {
    draft: '',
    focus: true,
    disabled: false,
    placeholder: 'Type a message…',
    typingTimeout: 3000,
  }

  constructor(props) {
    super(props);
    this.handleAttachment = this.handleAttachment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
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
      dispatch(closeConversation(conversation));
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
    const text = trim(this.textarea.value);
    if (disabled || !text) {
      return;
    }

    if (conversation.isNew) {
      this.textarea.blur();
      this.createNewConversation(conversation, text);
    } else {
      dispatch(saveDraft(name, { draft: '' }));
      this.textarea.focus();
      dispatch(replyToConversation(conversation, loggedUser, { text }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.submit();
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

  handleAttachment(type, content) {
    const attachments = [];
    const attachment = { };
    switch (type) {
      case 'shout':
        attachment.type = 'shout';
        attachment.shout = content.id;
        break;
      case 'profile':
        attachment.type = 'profile';
        attachment.profile = content.id;
        break;
      case 'images':
        attachment.type = 'media';
        attachment.images = content;
        break;
      default:
        break;
    }
    attachments.push(attachment);
    this.props.dispatch(replyToConversation(
      this.props.conversation,
      this.props.loggedUser,
      { attachments }
    ));
  }

  handleKeyDown(e) {
    if (e.keyCode === ENTER && !e.shiftKey) {
      e.preventDefault();
      this.submit();
    }
  }

  render() {
    const { fields, name, conversation, ...attributes } = this.props;
    return (
      <form name={ name }
        className="ConversationReplyForm"
        onSubmit={ this.handleSubmit }
      >
        <TextareaAutosize
          { ...attributes }
          ref={ el => {
            this.textarea = el;
            if (this.props.inputRef) {
              this.props.inputRef(el);
            }
          } }
          className="htmlTextarea"
          maxRows={ 5 }
          disabled={ conversation.isCreating }
          name="draft"
          value={ fields.draft }
          autoComplete="off"
          onKeyDown={ this.handleKeyDown }
          onChange={ this.handleTextChange }
        />
        <div className="ConversationReplyForm-toolbar">
          <ReplyFormToolbar onAttachment={ this.handleAttachment } />
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const name = `conversationReply-${ownProps.conversation.id}`;
  return {
    name,
    loggedUser: getLoggedUser(state),
    fields: state.forms[name] || { draft: '' },
  };
};

export default connect(mapStateToProps)(ConversationReplyForm);
