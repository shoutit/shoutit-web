import React, { PropTypes } from 'react';

import { imagesPath } from '../config';
import { getCountryName } from '../utils/LocationUtils';

import Tooltip from '../ui/Tooltip';

const VERSION = 1; // change version to skip browser cache

if (process.env.BROWSER) {
  require('./CountryFlag.scss');
}

export default function CountryFlag({ code, size = 'medium', rounded = false, showTooltip = true }) {
  code = code.toUpperCase();
  let className = 'CountryFlag';
  if (size) {
    className += ` size-${size}`;
  }
  if (rounded) {
    className += ' rounded';
  }
  return (
    <Tooltip placement="top" overlay={ getCountryName(code) } trigger={ showTooltip ? ['hover'] : [] }>
      <span>
        <img className={ className } src={ `${imagesPath}/flags/${code}.png?v${VERSION}` } />
      </span>
    </Tooltip>
  );
}

CountryFlag.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.string,
  rounded: PropTypes.bool,
};
