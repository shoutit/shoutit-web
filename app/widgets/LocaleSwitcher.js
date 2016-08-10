import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';
import { getQueryAsString } from '../reducers/routing';

const LANGUAGES = [
  { code: 'ar', name: 'العربية' },
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: '中文' },
];

export function LocaleSwitcher({ search, currentLanguage }) {
  return (
    <div className="LocaleSwitcher">
      { LANGUAGES.map(language => {
        let className;
        if (language.code === 'ar') {
          className = 'rtl';
        }
        if (currentLanguage === language.code) {
          className += ' selected';
        }
        return (<a
          key={ language.code }
          className={ className }
          href={ `?${search}&hl=${language.code}&set` }>
          { language.name }
        </a>);
      }) }
    </div>
  );
}

LocaleSwitcher.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  search: PropTypes.string,
};

const mapStateToProps = state => ({
  currentLanguage: getCurrentLanguage(state),
  search: getQueryAsString(state, ['hl', 'set']),
});

export default connect(mapStateToProps)(LocaleSwitcher);
