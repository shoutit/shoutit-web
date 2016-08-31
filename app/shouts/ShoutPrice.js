/* eslint no-nested-ternary: 0 */
import React, { PropTypes } from 'react';
import { FormattedNumber, FormattedMessage } from 'react-intl';

import './ShoutPrice.scss';

export default function ShoutPrice({ shout, layout = 'plain' }) {
  let { price } = shout;
  const isFree = price === 0;
  const isNegotiable = price === null;
  let className = `ShoutPrice ${layout}`;

  if (isFree) {
    className += ' free';
  } else {
    price /= 100;
  }

  return (
    <span className={ className }>
      { isFree ?
        <FormattedMessage
          id="shoutPrice.free"
          defaultMessage="Free"
        /> :
        isNegotiable ?
          <FormattedMessage
            id="shoutPrice.negotiable"
            defaultMessage="Negotiable price"
          /> :
          <FormattedNumber
            style="currency"
            currencyDisplay="symbol"
            currency={ shout.currency }
            value={ price }
            maximumFractionDigits={ Number.isInteger(price) ? 0 : undefined }
            minimumFractionDigits={ Number.isInteger(price) ? 0 : undefined }
          />
      }
    </span>
  );
}

ShoutPrice.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
