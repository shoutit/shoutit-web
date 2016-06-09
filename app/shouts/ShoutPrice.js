import React, { PropTypes } from 'react';
import { FormattedNumber, FormattedMessage } from 'react-intl';

if (process.env.BROWSER) {
  require('./ShoutPrice.scss');
}
export default function ShoutPrice({ shout, layout = 'plain' }) {
  const isFree = !shout.price;
  let className = `ShoutPrice ${layout}`;
  if (isFree) {
    className += ' free';
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
          value={ shout.price }
        />
      }
    </span>
  );
}

ShoutPrice.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
