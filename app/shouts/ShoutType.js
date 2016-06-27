import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import './ShoutType.scss';
export default function ShoutType({ shout, layout = 'badge' }) {
  let className = `ShoutType ${layout} ${shout.type}`;
  return (
    <span className={ className }>
      <FormattedMessage
        id="shoutType"
        defaultMessage="{type, select,
            offer {Offer}
            request {Request}
        }"
        values={ { type: shout.type } } />
    </span>
  );
}

ShoutType.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
