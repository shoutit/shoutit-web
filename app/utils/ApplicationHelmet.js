import React, { PropTypes } from 'react';
import union from 'lodash/union';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as config from '../config';
import { getCurrentUrl } from '../reducers/routing';

import {
  getSupportedLocales,
  getSupportedLanguages,
  getCurrentLocale,
  isRtl,
} from '../reducers/i18n';

/**
 * React Helmet to include the basic meta tags for the whole application.
 * Must be included once in the root component.
 *
 * @export
 * @param {any} {
 *   currentUrl,
 *   currentLocale,
 *   currentLanguage,
 *   supportedLocales,
 *   rtl,
 * }
 * @returns
 */
export function ApplicationHelmet({
  currentUrl,
  currentLocale,
  currentLanguage,
  supportedLocales,
  rtl,
}) {
  const url = `${config.siteUrl}${currentUrl}`.replace(/\/$/, '');

  // Base meta tags
  const base = [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
    { name: 'keywords', content: 'shoutit' },
  ];

  if (process.env.SHOUTIT_ENV !== 'live') {
    base.push({ name: 'robots', content: 'noindex' });
  }

  // Open Graph
  const openGraph = [
    { property: 'fb:app_id', content: config.facebookId },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: currentLocale, id: 'ogLocale' },
    { property: 'og:site_name', content: 'Shoutit' },
    { property: 'og:type', content: 'website' },
  ];
  supportedLocales
    .filter(locale => locale !== currentLocale)
    .forEach(locale => openGraph.push({ property: 'og:locale:alternate', content: locale }));

  const appLinks = [
    { property: 'al:ios:app_store_id', content: config.iosAppId },
    { property: 'al:ios:app_name', content: config.iosAppName },
    { property: 'al:android:package', content: config.androidPackage },
    { property: 'al:android:app_name', content: config.androidAppName },
    { property: 'al:web:url', content: url },
  ];

  // Twitter meta tags
  const twitter = [
    { name: 'twitter:site', content: '@Shoutitcom' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:app:name:iphone', content: config.iosAppName },
    { name: 'twitter:app:name:ipad', content: config.iosAppName },
    { name: 'twitter:app:name:googleplay', content: 'Shoutit' },
    { name: 'twitter:app:id:iphone', content: config.iosAppId },
    { name: 'twitter:app:id:ipad', content: config.iosAppId },
    { name: 'twitter:app:id:googleplay', content: config.androidPackage },
  ];

  const meta = union(
    base,
    openGraph,
    twitter,
    appLinks,
  );

  // <html> Attributes
  let lang = currentLanguage;
  if (lang === 'ar') {
    // Make sure we use latin numbers in arabic
    lang = 'ar-u-nu-latn';
  }
  const htmlAttributes = {
    lang: currentLanguage,
    dir: rtl ? 'rtl' : 'ltr',
  };

  // Links
  let link = [
    { rel: 'canonical', href: url },
    { rel: 'shortcut icon', href: `${config.publicUrl}/images/favicons/favicon.ico` },
    { rel: 'apple-touch-icon', sizes: '256x256', href: `${config.publicUrl}/images/favicons/apple-touch-icon.png` },
  ];
  // Temporary disable alternate lang hrefs until we have a better router
  //
  // supportedLanguages
  //   .filter(language => language !== currentLanguage)
  //   .forEach(language =>
  //     link.push({
  //       rel: 'alternate',
  //       href: `${url}?hl=${language}`,
  //       hrefLang: language,
  //     }));
  return (
    <Helmet
      meta={ meta }
      link={ link }
      htmlAttributes={ htmlAttributes }
    />
  );
}

ApplicationHelmet.propTypes = {
  currentLanguage: PropTypes.string,
  currentLocale: PropTypes.string,
  currentUrl: PropTypes.string.isRequired,
  hideBadge: PropTypes.bool,
  rtl: PropTypes.bool,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  supportedLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  currentLocale: getCurrentLocale(state),
  supportedLocales: getSupportedLocales(state),
  supportedLanguages: getSupportedLanguages(state),
  rtl: isRtl(state),
  currentUrl: getCurrentUrl(state),
});

export default connect(mapStateToProps)(ApplicationHelmet);
