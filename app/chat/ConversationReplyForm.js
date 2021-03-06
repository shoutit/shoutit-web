import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import trim from 'lodash/trim';
import { FormattedMessage } from 'react-intl';
import TextareaAutosize from 'react-textarea-autosize';

import { saveDraft } from '../actions/forms';

import { replyToConversation, closeConversation, openConversation } from '../actions/conversations';

import { startTyping } from '../actions/chat';
import { chatWithProfile } from '../actions/users';
import { replyToShout } from '../actions/shouts';

import { ENTER } from '../utils/keycodes';
import { getLoggedProfile } from '../reducers/session';

import ReplyFormToolbar from '../chat/ReplyFormToolbar';

import './ConversationReplyForm.scss';

export class ConversationReplyForm extends Component {

  static propTypes = {
    draft: PropTypes.string,
    fields: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    conversation: PropTypes.object.isRequired,
    loggedProfile: PropTypes.object.isRequired,
    typingTimeout: PropTypes.number,
    focus: PropTypes.bool,
    disabled: PropTypes.bool,
    inputRef: PropTypes.func,
  };

  static defaultProps = {
    draft: '',
    focus: true,
    disabled: false,
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
    const { disabled, conversation, dispatch, loggedProfile, name } = this.props;
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
      dispatch(replyToConversation(conversation, loggedProfile, { text }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.submit();
  }

  handleTextChange(e) {
    const text = e.target.value;
    const { typingTimeout, dispatch, name, loggedProfile } = this.props;
    dispatch(saveDraft(name, { draft: text }));

    if (text && !this.isTyping) {
      const payload = { id: loggedProfile.id, name: loggedProfile.name };
      this.isTyping = true;
      dispatch(startTyping(payload));
      this.typingTimeout = setTimeout(() => {
        dispatch(startTyping(payload));
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
      this.props.loggedProfile,
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
        <FormattedMessage id="chat.replyForm.placeholder" defaultMessage="Type a message…">
          {
            placeholder =>
              <TextareaAutosize
                { ...attributes }
                ref={ el => {
                  this.textarea = el;
                  if (this.props.inputRef) {
                    this.props.inputRef(el);
                  }
                } }
                placeholder={ placeholder }
                className="htmlTextarea"
                maxRows={ 5 }
                disabled={ conversation.isCreating }
                name="draft"
                value={ fields.draft }
                autoComplete="off"
                onKeyDown={ this.handleKeyDown }
                onChange={ this.handleTextChange }
              />
          }
        </FormattedMessage>

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
    loggedProfile: getLoggedProfile(state),
    fields: state.forms[name] || { draft: '' },
  };
};

export default connect(mapStateToProps)(ConversationReplyForm);
