import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./HorizontalRule.scss');
}

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
