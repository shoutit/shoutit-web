import React, { PropTypes } from 'react';

import './DestructiveAction.scss';
export default function DestructiveAction({ label, description, onClick }) {
  return (
    <span className="DestructiveAction">
      <span onClick={ onClick } className="DestructiveAction-label">
        { label }
      </span>
      <span className="DestructiveAction-description">
        { description }
      </span>
    </span>

  );
}

DestructiveAction.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
