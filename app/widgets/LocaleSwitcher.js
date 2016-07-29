import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import { getQueryAsString } from '../reducers/routing';

const LOCALES = [
  { code: 'ar', name: 'العربية' },
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: '中文' },
];

export function LocaleSwitcher({ search, currentLocale }) {
  return (
    <div className="LocaleSwitcher">
      { LOCALES.map(locale => {
        let className;
        if (locale.code === 'ar') {
          className = 'rtl';
        }
        if (currentLocale === locale.code) {
          className += ' selected';
        }
        return (<a
          key={ locale.code }
          className={ className }
          href={ `?${search}&hl=${locale.code}&set` }>
          { locale.name }
        </a>);
      }) }
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
