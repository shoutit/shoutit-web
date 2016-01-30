import React, { PropTypes, Component } from "react";
import {Input, Button} from "react-bootstrap";

if (process.env.BROWSER) {
  require("styles/components/MessageReplyForm.scss");
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
    onTextChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    draft: "",
    autoFocus: false,
    disabled: false,
    placeholder: "Send a message",
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
    if (disabled || !e.target.input.value.trim()) {
      return;
    }
    onSubmit(e);
    e.target.input.focus();
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
    const  { draft, autoFocus, disabled=false,  placeholder } = this.props;
    return (
      <form className="MessageReplyForm" onSubmit={ e => this.handleFormSubmit(e) }>
        <div className="MessageReplyForm-inputContainer">
          <Input
            autoFocus={ autoFocus }
            placeholder={ placeholder }
            disabled={ disabled }
            name="input"
            type="text"
            onChange={ e => this.handleTextChange(e) }
            value={ draft }
          />
        </div>
        <div>
          <Button type="submit" disabled={ disabled } className="reply">
            Send
          </Button>
        </div>
      </form>
    );
  }
}
