import React from 'react';
import { Link } from 'react-router';

import { imagesPath, facebookLink, twitterLink, instagramLink, appStoreLink, playStoreLink } from '../config';

if (process.env.BROWSER) {
  require('./Footer.scss');
}
export default function Footer() {
  return (
    <div className="Footer">
      <div className="htmlContentWidth Footer-wrapper">
        <div className="Footer-logo">
          <Link to="/">
            <img src={`${imagesPath}/logo-mark-inverted.png`} height="40" />
          </Link>
        </div>
        <div className="Footer-links">
          <h3>Follow us</h3>
          <a target="_blank" href={ facebookLink }>Facebook</a>
          <a target="_blank" href={ twitterLink }>Twitter</a>
          <a target="_blank" href={ instagramLink }>Instagram</a>
        </div>
        <div className="Footer-apps">
          <a href={appStoreLink} target="_blank">
            <img src={`${imagesPath}/app-store-badge.png`} height="40" />
          </a>
          <a href={playStoreLink} target="_blank">
            <img src={`${imagesPath}/google-play-badge.png`} height="40" />
          </a>
        </div>
      </div>
      <div className="Footer-copyright">
        Copyright © { (new Date().getFullYear()) } Shoutit – All Rights Reserved.
      </div>
    </div>
  );
}
