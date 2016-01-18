import React from "react";
import {Input, Button} from "react-bootstrap";

/**
 * A simple form to send a message. Accept draft objects.
 * @param {Object}    props.draft
 * @param {Boolean}   props.disabled
 * @param {Boolean}   props.autoFocus
 * @param {Function}  props.onSubmit
 * @param {Function}  props.onTextChange
 */
export default function MessageReplyForm({ draft, autoFocus, disabled=false, onSubmit, onTextChange }) {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (disabled || !e.target.input.value.trim()) {
      return;
    }
    onSubmit(e);
    e.target.input.focus();
    
  };
  return(
    <form className="MessageReplyForm" onSubmit={ handleFormSubmit }>
      <div className="MessageReplyForm-inputContainer">
        <Input
          autoFocus={ autoFocus }
          placeholder="Send a message"
          disabled={ disabled }
          name="input"
          type="text"
          onChange={ e => onTextChange(e.target.value) }
          value={ draft }
        />
      </div>
      <div>
        <Button type="submit" disabled={ disabled } className="reply">Send</Button>
      </div>
    </form>
  );

}
