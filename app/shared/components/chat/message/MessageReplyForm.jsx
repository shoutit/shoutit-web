import React from 'react';

export default function MessageReplyForm({ onTextChange, draft, onSubmit, disabled=false }) {

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
