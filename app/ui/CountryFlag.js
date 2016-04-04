import React from 'react';

import { imagesPath } from '../config';
import { getCountryName } from '../utils/LocationUtils';

import Tooltip from '../ui/Tooltip';

const VERSION = 1; // change version to skip browser cache

if (process.env.BROWSER) {
  require('./CountryFlag.scss');
}

export default function CountryFlag({ code, size }) {
  code = code.toUpperCase();
  let className = 'CountryFlag';
  if (size) {
    className += ` size-${size}`;
  }
  return (
    <Tooltip placement="top" overlay={ getCountryName(code) }>
      <span>
        <img className={ className } src={ `${imagesPath}/flags/${code}.png?v${VERSION}` } />
      </span>
    </Tooltip>
  );
}
