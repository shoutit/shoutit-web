import React from 'react';

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
    <form className="input-chat" onSubmit={ handleFormSubmit }>
      <input
        disabled={ disabled }
        name="input"
        type="text"
        onChange={ e => onTextChange(e.target.value) }
        value={ draft && draft.text }
      />
      <div className="input-text-bottom">
        <button disabled={ disabled } className="reply">Send</button>
      </div>
    </form>
  )

}
