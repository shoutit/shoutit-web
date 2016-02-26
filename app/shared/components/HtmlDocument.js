/* eslint react/no-danger: 0 */

import React from "react";
import config from "../../../config";

let chunkNames = { main: "/assets/main.js", css: "/assets/main.css" };
if (process.env.NODE_ENV === "production") {
  chunkNames = require("../../../public/stats.json");
}

export default function HtmlDocument({
  content,
  title,
  state,
  meta
}) {

  const metatags = [];
  metatags.push({ property: "fb:app_id", content: config.facebookId });
  metatags.push({ property: "og:url", content: meta.url });
  metatags.push({ property: "og:title", content: meta.title });
  metatags.push({ property: "og:description", content: meta.description });
  metatags.push({ property: "og:site_name", content: meta.siteName });
  metatags.push({ property: "og:image", content: meta.image });

  switch (meta.type) {
  case "offer": metatags.push({ property: "og:type", content: "shoutitcom:offer" }); break;
  case "request": metatags.push({ property: "og:type", content: "shoutitcom:request" }); break;
  case "user": metatags.push({ property: "og:type", content: "shoutitcom:user" }); break;
  }

  if (meta.price) {
    metatags.push({ property: "shoutitcom:price", content: meta.price });
  }

  metatags.push({ name: "twitter:site", content: meta.twitter.site });
  metatags.push({ name: "twitter:url", content: meta.url });
  metatags.push({ name: "twitter:title", content: meta.title });
  metatags.push({ name: "twitter:description", content: meta.description });
  metatags.push({ name: "twitter:image", content: meta.image });

  if (meta.type === "home") {
    metatags.push({ name: "twitter:card", content: "app"} );
    metatags.push({ name: "twitter:app:id:iphone", content: meta.twitter.iPhone} );
    metatags.push({ name: "twitter:app:id:ipad", content: meta.twitter.iPad} );
    metatags.push({ name: "twitter:app:id:googleplay", content: meta.twitter.android} );
  } else if (meta.type === "shout" && meta.shoutType) {
    metatags.push({ name: "twitter:card", content: "product"} );
    metatags.push({ name: "twitter:label1", content: meta.shoutTypePrefix} );
    metatags.push({ name: "twitter:data1", content: meta.price} );
    metatags.push({ name: "twitter:label2", content: "Location"} );
    metatags.push({ name: "twitter:data2", content: meta.location} );
  } else {
    metatags.push({ name: "twitter:card", content: "summary" } );
  }

  return (
    <html>
      <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# shoutitcom: http://ogp.me/ns/fb/shoutitcom#">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />

        <title>{ title }</title>

        { metatags.map(props => <meta { ...props } />) }

        <link rel="shortcut icon" type="image/png" href={ `${config.publicUrl}/images/favicons/favicon.ico` } />
        <link rel="apple-touch-icon" type="image/png" size="256x256" href={ `${config.publicUrl}/images/favicons/apple-touch-icon.png` } />

        { process.env.NODE_ENV === "production" &&
          <link rel="stylesheet" type="text/css" href={ `${config.publicUrl}${chunkNames.css}` } /> }

      </head>

      <body>
        <div id="content" dangerouslySetInnerHTML={ {__html: content} } />

        <script type="application/json" dangerouslySetInnerHTML={ {__html: state} } />

        <script async src="https://apis.google.com/js/client:platform.js" />
        { config.googleMapsKey &&
          <script async src={ `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsKey}&libraries=places&language=en-us` } /> }
        { config.ga &&
          <script async src="https://www.google-analytics.com/analytics.js" /> }

        <script async src={ `${config.publicUrl}${chunkNames.main}`} />

      </body>
    </html>
  );

}
