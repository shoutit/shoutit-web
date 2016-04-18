import React, { PropTypes } from 'react';
import currencyFormatter from 'currency-formatter';

if (process.env.BROWSER) {
  require('./ShoutPrice.scss');
}
export default function ShoutPrice({ shout, layout = 'badge' }) {
  const isFree = !shout.price;
  let className = `ShoutPrice ${layout}`;
  if (isFree) {
    className += ' free';
  }
  const price = shout.price / 100;
  return (
    <span className={ className }>
      { !isFree ?
          currencyFormatter.format(price, { code: shout.currency, precision: Number.isInteger(price) ? 0 : 2 })
        : 'Free'
      }
    </span>
  );
}

ShoutPrice.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
