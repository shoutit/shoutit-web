import React from 'react';
import {Input, Button} from 'react-bootstrap';

/**
 * A simple form to send a message. Accept draft objects.
 * @param {Object}    props.draft
 * @param {Boolean}   props.disabled
 * @param {Function}  props.onSubmit
 * @param {Function}  props.onTextChange
 */
export default function MessageReplyForm({ draft, disabled=false, onSubmit, onTextChange }) {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (disabled || !e.target.input.value.trim()) {
      return;
    }
    e.target.input.blur();
    onSubmit(e);
  }
  return(
    <form className="MessageReplyForm" onSubmit={ handleFormSubmit }>
      <div className="MessageReplyForm-inputContainer">
        <Input
          placeholder="Send a message"
          disabled={ disabled }
          name="input"
          type="text"
          onChange={ e => onTextChange(e.target.value) }
          value={ draft && draft.text }
        />
      </div>
      <div>
        <Button type="submit" disabled={ disabled } className="reply">Send</Button>
      </div>
    </form>
  )

}
