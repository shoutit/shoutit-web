import React from 'react';
import { Link } from 'react-router';
import AppBadge from '../ui/AppBadge';

import { imagesPath, facebookLink, twitterLink, instagramLink } from '../config';

if (process.env.BROWSER) {
  require('./Footer.scss');
}
export default function Footer() {
  return (
    <div className="Footer">
      <div className="htmlContentWidth Footer-wrapper">
        <div className="Footer-logo">
          <Link to="/">
            <img alt="To home page" src={ `${imagesPath}/logo-mark-inverted.png` } height="40" />
          </Link>
        </div>
        <div className="Footer-links">
          <h3>Follow us</h3>
          <a target="_blank" href={ facebookLink }>Facebook</a>
          <a target="_blank" href={ twitterLink }>Twitter</a>
          <a target="_blank" href={ instagramLink }>Instagram</a>
        </div>
        <div className="Footer-apps">
          <AppBadge store="appStore" height={ 40 } />
          <AppBadge store="googlePlay" height={ 40 } />
        </div>
      </div>
      <div className="Footer-copyright">
        Copyright © { (new Date().getFullYear()) } Shoutit – All Rights Reserved.
      </div>
    </div>
  );
}
