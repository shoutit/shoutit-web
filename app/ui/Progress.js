import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import './Progress.scss';

export default function Progress({ animate = false, spaced = true, style, size }) {
  let className = 'Progress';
  if (animate) {
    className += ' animated';
  }
  if (!spaced) {
    className += ' no-space';
  }
  if (size) {
    className += ` size-${size}`;
  }
  return (
    <div className={ className } style={ style }>
      <div className="Progress-wrapper">
        <div className="Progress-label">
          <div className="Progress-animation" />
          <FormattedMessage
            id="ui.progress.label"
            defaultMessage="Loading…"
            />
        </div>
      </div>
    </div>
  );
}

Progress.propTypes = {
  animate: PropTypes.bool,
  spaced: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.oneOf(['small']),
};
