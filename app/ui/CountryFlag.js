import React, { PropTypes } from 'react';

import { imagesPath } from '../config';
import { getCountryName } from '../utils/LocationUtils';

import Tooltip from '../ui/Tooltip';

const VERSION = 1; // change version to skip browser cache

if (process.env.BROWSER) {
  require('./CountryFlag.scss');
}

export default function CountryFlag({ code, size = 'medium', rounded = true, showTooltip = true, style }) {
  code = code.toUpperCase();
  let className = 'CountryFlag';
  if (size) {
    className += ` size-${size}`;
  }
  if (rounded) {
    className += ' rounded';
  }
  const countryName = getCountryName(code);
  return (
    <Tooltip placement="top" overlay={ countryName } trigger={ showTooltip ? ['hover'] : [] }>
      <img alt={ countryName } className={ className } style={ style } src={ `${imagesPath}/flags/${code}.png?v${VERSION}` } />
    </Tooltip>
  );
}

CountryFlag.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.string,
  rounded: PropTypes.bool,
  style: PropTypes.object,
  showTooltip: PropTypes.bool,
};
