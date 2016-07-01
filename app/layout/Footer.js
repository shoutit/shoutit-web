import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, FormattedDate } from 'react-intl';
import AppBadge from '../ui/AppBadge';
import LocaleSwitcher from '../ui/LocaleSwitcher';

import { imagesPath, facebookLink, twitterLink, instagramLink } from '../config';

import './Footer.scss';

export default function Footer() {
  return (
    <div className="Footer">
      <div className="Footer-wrapper">
        <div className="Footer-logo">
          <Link to="/">
            <img alt="" src={ `${imagesPath}/logo-mark-inverted.png` } height="33" />
          </Link>
        </div>
        <div className="Footer-links">
          <h3>
            <FormattedMessage
              id="footer.social.title"
              defaultMessage="Follow us"
            />
          </h3>
          <a target="_blank" href={ facebookLink }>
            <FormattedMessage
              id="footer.social.facebook"
              defaultMessage="Facebook"
            />
          </a>
          <a target="_blank" href={ twitterLink }>
            <FormattedMessage
              id="footer.social.twitter"
              defaultMessage="Twitter"
            />
          </a>
          <a target="_blank" href={ instagramLink }>
            <FormattedMessage
              id="footer.social.instagram"
              defaultMessage="Instagram"
            />
          </a>
        </div>
        <div className="Footer-links">
          <h3>
            <FormattedMessage
              id="footer.language.title"
              defaultMessage="Language"
            />
          </h3>
          <LocaleSwitcher />
        </div>
        <div className="Footer-apps">
          <AppBadge appstore="appStore" height={ 40 } />
          <AppBadge appstore="googlePlay" height={ 40 } />
        </div>
      </div>
      <div className="Footer-copyright">
        <FormattedMessage
          id="footer.copyright"
          defaultMessage="Copyright © {year} Shoutit – All Rights Reserved."
          values={ { year: <FormattedDate value={ new Date() } year="numeric" /> } }
        />
      </div>
    </div>
  );
}
