import React from 'react';
import AppBadge from '../ui/AppBadge';
import { facebookLink, twitterLink, instagramLink } from '../config';

if (process.env.BROWSER) {
  require('./MiniFooter.scss');
}

export default function MiniFooter() {
  return (
    <div className="MiniFooter">
      <h3>Shoutit app</h3>

      <div className="MiniFooter-apps">
        <AppBadge store="appStore" height={ 32 } />
        <AppBadge store="googlePlay" height={ 32 } />
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
