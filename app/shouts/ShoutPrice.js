import React, { PropTypes } from 'react';
import { FormattedNumber, FormattedMessage } from 'react-intl';

import './ShoutPrice.scss';
export default function ShoutPrice({ shout, layout = 'plain' }) {
  const isFree = !shout.price;
  let { price } = shout;
  let className = `ShoutPrice ${layout}`;
  if (isFree) {
    className += ' free';
  } else {
    price = price / 100;
  }
  return (
    <span className={ className }>
      { isFree ?
        <FormattedMessage
          id="shoutPrice.free"
          defaultMessage="Free"
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
