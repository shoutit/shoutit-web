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
  return (
    <span className={ className }>
      { !isFree ?
        currencyFormatter.format(shout.price / 100, { code: shout.currency })
        : 'Free'
      }
    </span>
  );
}

ShoutPrice.propTypes = {
  layout: PropTypes.oneOf(['badge', 'plain']),
  shout: PropTypes.object.isRequired,
};
