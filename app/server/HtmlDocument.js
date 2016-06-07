/* eslint react/no-danger: 0 */

import React, { PropTypes } from 'react';
import serialize from 'serialize-javascript';
import newrelic, { newrelicEnabled } from './newrelic';
import uservoice from './uservoice';
import Helmet from '../utils/Helmet';

import * as config from '../config';

let chunkNames = { main: '/assets/main.js', css: '/assets/main.css' };

if (process.env.NODE_ENV === 'production') {
  chunkNames = require('../../built/public/stats.json'); // eslint-disable-line import/no-unresolved
}

export default function HtmlDocument({
  content,
  initialState,
}) {
  const head = Helmet.rewind();
  const attrs = head.htmlAttributes.toComponent();
  return (
    <html {...attrs}>
      <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# shoutitcom: http://ogp.me/ns/fb/shoutitcom#">

        { head.title.toComponent() }
        { head.meta.toComponent() }
        { head.link.toComponent() }

        { process.env.NODE_ENV === 'production' &&
          <link rel="stylesheet" type="text/css" href={ `${config.publicUrl}${chunkNames.css}` } /> }

        { newrelicEnabled &&
          <script type="text/javascript" dangerouslySetInnerHTML={ {
            __html: newrelic.getBrowserTimingHeader().replace(/<\/?script[^>]*>/g, '') } }
          />
        }
      </head>

      <body>
        <div id="content" dangerouslySetInnerHTML={ { __html: content } } />

        <script dangerouslySetInnerHTML={ { __html: `window.__INITIAL_STATE__=${serialize(initialState)}` } } />

        <script async src="https://apis.google.com/js/client:platform.js" />
        { config.googleMapsKey &&
          <script async src={ `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsKey}&libraries=places&language=en-us` } /> }
        { config.ga &&
          <script async src="https://www.google-analytics.com/analytics.js" /> }

        <script src="https://media.twiliocdn.com/sdk/js/common/v0.1/twilio-common.min.js" />
        <script src="https://media.twiliocdn.com/sdk/js/conversations/v0.13/twilio-conversations.min.js" />

        <script dangerouslySetInnerHTML={ { __html: uservoice } } />

        <script src={ `${config.publicUrl}${chunkNames.main}` } />

      </body>
    </html>
  );
}

HtmlDocument.propTypes = {
  content: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
};
