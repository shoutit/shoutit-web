import React, { PropTypes } from 'react';
import { formatPrice } from '../utils/CurrencyUtils';

if (process.env.BROWSER) {
  require('./ShoutPrice.scss');
}
export default function ShoutPrice({ shout, layout = 'badge' }) {
  const isFree = !shout.price;
  let className = `ShoutPrice ${layout}`;
  if (isFree) {
    className += ' free';
  }
  return (
    <span className={ className }>
      { formatPrice(shout.price, shout.currency) }
    </span>
  );
}

ShoutPrice.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
