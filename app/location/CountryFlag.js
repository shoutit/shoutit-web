import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';
import Tooltip from '../widgets/Tooltip';

import { IMAGES_PATH } from '../config';
import { getCountryName } from '../utils/LocationUtils';
import './CountryFlag.scss';

const VERSION = 1; // change version to skip browser cache

export function CountryFlag({ code, tooltipPlacement = 'top', size = 'medium', rounded = true, style, language, onClick }) {
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
  const countryName = getCountryName(code, language);
  return (
    <Tooltip placement={ tooltipPlacement } overlay={ countryName }>
      <img
        alt={ countryName }
        className={ className }
        style={ style }
        src={ `${IMAGES_PATH}/flags/${code}.png?v${VERSION}` }
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
  language: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});

export default connect(mapStateToProps)(CountryFlag);
