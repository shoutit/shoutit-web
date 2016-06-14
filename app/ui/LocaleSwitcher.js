import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import { getQueryAsString } from '../reducers/routing';
export function LocaleSwitcher({ search, currentLocale }) {

  return (
    <div className="LocaleSwitcher">
      <a className={ currentLocale === 'en' ? 'selected ' : '' } href={ `?${search}&hl=en&set` }>
        English
      </a>
      <a className={ currentLocale === 'ar' ? 'selected ' : '' } href={ `?${search}&hl=ar&set` }>
        العربية
      </a>
    </div>
  );
}

LocaleSwitcher.propTypes = {
  currentLocale: PropTypes.string.isRequired,
  search: PropTypes.string,
};

const mapStateToProps = state => ({
  currentLocale: getCurrentLocale(state),
  search: getQueryAsString(state, ['hl', 'set']),
});

export default connect(mapStateToProps)(LocaleSwitcher);
