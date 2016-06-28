import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import Tooltip from '../ui/Tooltip';

import { imagesPath } from '../config';
import { getCountryName } from '../utils/LocationUtils';

const VERSION = 1; // change version to skip browser cache

import './CountryFlag.scss';

export function CountryFlag({ code, tooltipPlacement = 'top', size = 'medium', rounded = true, style, locale, onClick }) {
  code = code.toUpperCase();
  let className = 'CountryFlag';
  if (size) {
    className += ` size-${size}`;
  }
  if (rounded) {
    className += ' rounded';
  }
  if (onClick) {
    className += ' clickable';
  }
  const countryName = getCountryName(code, locale);
  return (
    <Tooltip placement={ tooltipPlacement } overlay={ countryName }>
      <img
        alt={ countryName }
        className={ className }
        style={ style }
        src={ `${imagesPath}/flags/${code}.png?v${VERSION}` }
        onClick={ onClick }
      />
    </Tooltip>
  );
}

CountryFlag.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.string,
  rounded: PropTypes.bool,
  style: PropTypes.object,
  tooltipPlacement: PropTypes.string,
  onClick: PropTypes.func,
  showTooltip: PropTypes.bool,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(CountryFlag);
