import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';
import { imagesPath, appStoreLink, playStoreLink } from '../config';

export function AppBadge({ appstore, language, ...props }) {
  let href;
  let image;
  switch (appstore) {
    case 'appStore':
      href = appStoreLink;
      image = 'app-store';
      break;
    case 'googlePlay':
      href = playStoreLink;
      image = 'play-store';
      break;
    default:
  }
  delete props.dispatch;
  return (
    <a href={ href } target="_blank" rel="noopener noreferrer" className="AppBadge">
      <img
        { ...props }
        src={ `${imagesPath}/badges/${image}.${language}.png` }
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
