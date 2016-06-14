import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import { getQueryAsString } from '../reducers/routing';

const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

export function LocaleSwitcher({ search, currentLocale }) {

  return (
    <div className="LocaleSwitcher">
      { LOCALES.map(locale =>
        <a className={ currentLocale === locale.code ? 'selected ' : '' } href={ `?${search}&hl=${locale.code}&set` }>
          { locale.name }
        </a>
        ) }
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
