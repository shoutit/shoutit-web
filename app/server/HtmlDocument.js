/* eslint react/no-danger: 0 */

import React, { PropTypes } from 'react';
import serialize from 'serialize-javascript';
import newrelic, { newrelicEnabled } from './newrelic';
import uservoice from './uservoice';
import Helmet from '../utils/Helmet';
import { getCurrentLocale, isRtl } from '../reducers/i18n';

import * as config from '../config';

let chunkNames = {
  main: '/assets/main.js',
  css: '/assets/main.css',
  cssRtl: '/assets/main-rtl.css',
};

if (process.env.NODE_ENV === 'production') {
  chunkNames = require('../../public/stats.json'); // eslint-disable-line import/no-unresolved
}

export default function HtmlDocument({
  content,
  initialState,
}) {
  const head = Helmet.rewind();
  const attrs = head.htmlAttributes.toComponent();
  const locale = getCurrentLocale(initialState);
  const rtl = isRtl(initialState);
  return (
    <html {...attrs}>
      <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# shoutitcom: http://ogp.me/ns/fb/shoutitcom#">

        { head.title.toComponent() }
        { head.meta.toComponent() }
        { head.link.toComponent() }

        { process.env.NODE_ENV === 'production' &&
          <link rel="stylesheet" type="text/css" href={ `${config.publicUrl}${chunkNames[rtl ? 'cssRtl' : 'css']}` } /> }

        { newrelicEnabled &&
          <script type="text/javascript" dangerouslySetInnerHTML={ {
            __html: newrelic.getBrowserTimingHeader().replace(/<\/?script[^>]*>/g, '') } }
          />
        }
      </head>

      <body>
        <div id="content" dangerouslySetInnerHTML={ { __html: content } } />

        <script dangerouslySetInnerHTML={ { __html: `window.__INITIAL_STATE__=${serialize(initialState)}` } } />

        <script dangerouslySetInnerHTML={ { __html: `window.___gcfg = {lang: '${locale}'}` } } />
        <script async src="https://apis.google.com/js/client:platform.js" />
        { config.googleMapsKey &&
          <script async src={ `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsKey}&libraries=places&language=${locale}` } /> }
        { config.ga &&
          <script async src="https://www.google-analytics.com/analytics.js" /> }

        <script src="https://media.twiliocdn.com/sdk/js/common/v0.1/twilio-common.min.js" />
        <script src="https://media.twiliocdn.com/sdk/js/conversations/v0.13/twilio-conversations.min.js" />

        <script dangerouslySetInnerHTML={ { __html: uservoice.replace('{locale}', locale) } } />

        <script src={ `${config.publicUrl}${chunkNames.main}` } />

      </body>
    </html>
  );
}

HtmlDocument.propTypes = {
  content: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
};
