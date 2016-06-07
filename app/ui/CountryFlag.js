import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';

import Tooltip from '../ui/Tooltip';

import { imagesPath } from '../config';
import { getCountryName } from '../utils/LocationUtils';

const VERSION = 1; // change version to skip browser cache

if (process.env.BROWSER) {
  require('./CountryFlag.scss');
}

export function CountryFlag({ code, size = 'medium', rounded = true, style, intl }) {
  code = code.toUpperCase();
  let className = 'CountryFlag';
  if (size) {
    className += ` size-${size}`;
  }
  if (rounded) {
    className += ' rounded';
  }
  const countryName = getCountryName(code, intl.locale);
  return (
    <Tooltip position="top" overlay={ countryName }>
      <img alt={ countryName } className={ className } style={ style } src={ `${imagesPath}/flags/${code}.png?v${VERSION}` } />
    </Tooltip>
  );
}

CountryFlag.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.string,
  rounded: PropTypes.bool,
  style: PropTypes.object,
  intl: PropTypes.object.isRequired,
  showTooltip: PropTypes.bool,
};

export default injectIntl(CountryFlag);
