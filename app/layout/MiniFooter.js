import React from 'react';

import { imagesPath, facebookLink, twitterLink, instagramLink, appStoreLink, playStoreLink } from '../config';

if (process.env.BROWSER) {
  require('./MiniFooter.scss');
}

export default function MiniFooter() {
  return (
    <div className="MiniFooter">
      <h3>Shoutit app</h3>

      <div className="MiniFooter-apps">
        <a href={ appStoreLink } target="_blank">
          <img alt="App Store" src={ `${imagesPath}/app-store-badge.png` } height={ 32 } />
        </a>
        <a href={ playStoreLink } target="_blank">
          <img alt="Goolge Play" src={ `${imagesPath}/google-play-badge.png` } height={ 32 } />
        </a>
      </div>

      <h3>Follow us</h3>
      <div className="MiniFooter-follow">
        <a target="_blank" href={ facebookLink }>Facebook</a>
        <a target="_blank" href={ twitterLink }>Twitter</a>
        <a target="_blank" href={ instagramLink }>Instagram</a>
      </div>
{/*
      <div className="MiniFooter-copyright">
        Copyright © { (new Date().getFullYear()) } Shoutit – All Rights Reserved.
      </div>*/}

    </div>
  );
}
