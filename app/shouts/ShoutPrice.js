import React from 'react';
import currencyFormatter from 'currency-formatter';

export default function ShoutPrice({ shout }) {
  const isFree = !shout.price;
  let className='ShoutPrice';
  if (isFree) {
    className += ' free';
  }
  return (
    <span className={ className }>
      { !isFree ?
        currencyFormatter.format(shout.price / 100, { code: shout.currency })
        :
        'Free'
      }
    </span>
  );
}
