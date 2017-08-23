import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';
import { IMAGES_PATH, APP_STORE_LINK, PLAYSTORE_LINK } from '../config';

export function AppBadge({ appstore, language, ...props }) {
  let href;
  let image;
  switch (appstore) {
    case 'appStore':
      href = APP_STORE_LINK;
      image = 'app-store';
      break;
    case 'googlePlay':
      href = PLAYSTORE_LINK;
      image = 'play-store';
      break;
    default:
  }
  delete props.dispatch;
  return (
    <a href={ href } target="_blank" rel="noopener noreferrer" className="AppBadge">
      <img
        { ...props }
        src={ `${IMAGES_PATH}/badges/${image}.${language}.png` }
        alt=""
      />
    </a>
  );
}

AppBadge.propTypes = {
  appstore: PropTypes.oneOf(['appStore', 'googlePlay']).isRequired,
  language: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});

export default connect(mapStateToProps)(AppBadge);
