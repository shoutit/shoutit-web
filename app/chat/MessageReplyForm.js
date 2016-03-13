import React, { PropTypes, Component } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "../shared/components/helper/Button.jsx";
import SVGIcon from "../shared/components/helper/SVGIcon";

if (process.env.BROWSER) {
  require("./MessageReplyForm.scss");
}

/**
 * A simple form to send a message. Accept draft objects.
 * @param {Object}    props.draft
 * @param {Boolean}   props.disabled
 * @param {Boolean}   props.autoFocus
 * @param {Function}  props.onSubmit
 * @param {Function}  props.onTextChange
 * @param {Function}  props.onTyping
 */
export default class MessageReplyForm extends Component {

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
    const { disabled, onSubmit } = this.props;
    const text = e.target.draft.value.trim();
    if (disabled || !text) {
      return;
    }
    onSubmit(text);
    e.target.draft.value = "";
    e.target.draft.focus();
  }

  handleTextChange(e) {
    const text = e.target.value;
    const { onTextChange, onTyping, typingTimeout } = this.props;
    if (onTextChange) {
      onTextChange(text);
    }
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
    const  { initialValue, autoFocus, disabled, onAttachShoutClick, placeholder } = this.props;
    return (
      <form className="MessageReplyForm" onSubmit={ e => this.handleFormSubmit(e) }>
        <TextareaAutosize
          className="htmlTextarea"
          maxRows={5}
          name="draft"
          initialValue={ initialValue }
          disabled={ disabled }
          autoComplete="off"
          autoFocus={ autoFocus }
          placeholder={ placeholder }
          onChange={ e => this.handleTextChange(e) }
        />
        <Button leftIcon={ <SVGIcon name="send" fill /> } label="Send" primary type="submit" size="small" disabled={ disabled || !initialValue } className="reply" />
        <Button label="Attach shout" type="button" size="small" disabled={ disabled } onClick={ onAttachShoutClick } />
      </form>
    );
  }
}
