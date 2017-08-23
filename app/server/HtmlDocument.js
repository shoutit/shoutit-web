/* eslint react/no-danger: 0 */

import React, { PropTypes } from 'react';
import serialize from 'serialize-javascript';
import newrelic, { newrelicEnabled } from './newrelic';
import uservoice from './uservoice';
import mixpanel from './mixpanelClient';
import Helmet from '../utils/Helmet';
import { getCurrentLanguage, isRtl } from '../reducers/i18n';

import * as config from '../config';
import { ConfigScript } from '../config/utils';

let appChunkNames = {
  main: '/assets/main.js',
  css: '/assets/main.css',
  cssRtl: '/assets/main-rtl.css',
};

let vendorsChunkNames = {
  vendors: '/scripts/vendors.js',
};

if (process.env.NODE_ENV === 'production') {
  appChunkNames = require('../../public/chunknames-app.json'); // eslint-disable-line import/no-unresolved
  vendorsChunkNames = require('../../public/chunknames-vendors.json'); // eslint-disable-line import/no-unresolved
}

export default function HtmlDocument({
  content,
  initialState,
}) {
  const head = Helmet.rewind();
  const attrs = head.htmlAttributes.toComponent();
  const language = getCurrentLanguage(initialState);
  const rtl = isRtl(initialState);
  return (
    <html lang="en" { ...attrs }>
      <head prefix={ `og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# ${config.OG_PREFIX}: http://ogp.me/ns/fb/${config.OG_PREFIX}#` }>

        { head.title.toComponent() }
        { head.meta.toComponent() }
        { head.link.toComponent() }

        { process.env.NODE_ENV === 'production' &&
          <link rel="stylesheet" type="text/css" href={ `${config.PUBLIC_URL}${appChunkNames[rtl ? 'cssRtl' : 'css']}` } /> }

        { language === 'ar' ?
          <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/earlyaccess/droidarabickufi.css" /> :
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500&subset=latin-ext" rel="stylesheet" />
        }
        { newrelicEnabled &&
          <script type="text/javascript" dangerouslySetInnerHTML={ {
            __html: newrelic.getBrowserTimingHeader().replace(/<\/?script[^>]*>/g, '') } }
          />
        }
        <ConfigScript />

        <script type="text/javascript" dangerouslySetInnerHTML={ { __html: mixpanel } } />

        <script src={ `${config.PUBLIC_URL}${vendorsChunkNames.vendors}` } />

      </head>

      <body>
        <div id="content" dangerouslySetInnerHTML={ { __html: content } } />

        <script dangerouslySetInnerHTML={ { __html: `window.__INITIAL_STATE__=${serialize(initialState)}` } } />

        <script dangerouslySetInnerHTML={ { __html: `window.___gcfg = {lang: '${language}'}` } } />
        <script async src="https://apis.google.com/js/client:platform.js" />
        { config.GOOGLE_MAPS_KEY &&
          <script async src={ `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_KEY}&libraries=places&language=${language}` } /> }
        { config.GA &&
          <script async src="https://www.google-analytics.com/analytics.js" /> }

        { false && <script src="https://media.twiliocdn.com/sdk/js/common/v0.1/twilio-common.min.js" /> }
        { false && <script src="https://media.twiliocdn.com/sdk/js/conversations/v0.13/twilio-conversations.min.js" /> }

        <script dangerouslySetInnerHTML={ { __html: uservoice.replace('{language}', language) } } />

        <script src={ `${config.PUBLIC_URL}${appChunkNames.main}` } />

      </body>
    </html>
  );
}

HtmlDocument.propTypes = {
  content: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
};
