import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./ShoutType.scss');
}
export default function ShoutType({ shout, layout = 'badge' }) {
  let className = `ShoutType ${layout} ${shout.type}`;
  return (
    <span className={ className }>
      { shout.type }
    </span>
  );
}

ShoutType.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
