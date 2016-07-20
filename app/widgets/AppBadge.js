import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import { imagesPath, appStoreLink, playStoreLink } from '../config';

export function AppBadge({ appstore, locale, ...props }) {
  let href;
  let image;
  switch (appstore) {
    case 'appStore':
      href = appStoreLink;
      image = 'app-store-badge';
      break;
    case 'googlePlay':
      href = playStoreLink;
      image = 'google-play-badge';
      break;
    default:
  }
  delete props.dispatch;
  return (
    <a href={ href } target="_blank" className="AppBadge">
      <img
        { ...props }
        src={ `${imagesPath}/${image}-${locale}.png` }
        alt=""
      />
    </a>
  );
}

AppBadge.propTypes = {
  appstore: PropTypes.oneOf(['appStore', 'googlePlay']).isRequired,
  locale: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(AppBadge);
