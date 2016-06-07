import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { imagesPath, appStoreLink, playStoreLink } from '../config';

export function AppBadge({ store, intl, ...props }) {
  let href;
  let image;
  switch (store) {
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
  return (
    <a href={ href } target="_blank" className="AppBadge">
      <img
        {...props}
        src={ `${imagesPath}/${image}-${intl.locale}.png` }
        alt=""
      />
    </a>
  );
}

AppBadge.propTypes = {
  store: PropTypes.oneOf(['appStore', 'googlePlay']).isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AppBadge);
