import React from 'react';
import { FormattedMessage } from 'react-intl';

import LocaleSwitcher from '../ui/LocaleSwitcher';

import AppBadge from '../ui/AppBadge';
import { facebookLink, twitterLink, instagramLink } from '../config';

if (process.env.BROWSER) {
  require('./MiniFooter.scss');
}

export default function MiniFooter() {
  return (
    <div className="MiniFooter">
      <h3>
        <FormattedMessage
          id="minifooter.apps.title"
          defaultMessage="Shoutit apps"
        />
      </h3>

      <div className="MiniFooter-apps">
        <AppBadge appstore="appStore" height={ 32 } />
        <AppBadge appstore="googlePlay" height={ 32 } />
      </div>

      <h3>
        <FormattedMessage
          id="minifooter.language.title"
          defaultMessage="Language"
        />
      </h3>
      <div className="MiniFooter-language">
        <LocaleSwitcher />
      </div>
      <h3>
        <FormattedMessage
          id="minifooter.social.title"
          defaultMessage="Follow us"
        />
      </h3>
      <div className="MiniFooter-follow">
        <a target="_blank" href={ facebookLink }>
          <FormattedMessage
            id="minifooter.social.facebook"
            defaultMessage="Facebook"
          />
        </a>
        <a target="_blank" href={ twitterLink }>
          <FormattedMessage
            id="minifooter.social.twitter"
            defaultMessage="Twitter"
          />
        </a>
        <a target="_blank" href={ instagramLink }>
          <FormattedMessage
            id="minifooter.social.instagram"
            defaultMessage="Instagram"
          />
        </a>
      </div>
    </div>
  );
}
