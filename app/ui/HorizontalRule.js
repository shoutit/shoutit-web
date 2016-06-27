import React, { PropTypes } from 'react';

import './HorizontalRule.scss';

export default function HorizontalRule({ label }) {
  return (
    <div className="HorizontalRule">
      { label && <span>{ label }</span> }
    </div>
  );
}

HorizontalRule.propTypes = {
  label: PropTypes.string,
};
