import React, { PropTypes, Component } from 'react';
import ReactHelmet from 'react-helmet';
import { injectIntl, defineMessages } from 'react-intl';
import union from 'lodash/union';
import { connect } from 'react-redux';
import * as config from '../config';

import { getUnreadNotificationsCount, getUnreadConversationsCount } from '../reducers/session';
import { getVariation } from '../utils/APIUtils';

import {
  getSupportedLocales,
  getSupportedLanguages,
  getCurrentLocale,
  isRtl,
} from '../reducers/i18n';

function replaceOgPrefixForTag(tag) {
  if (tag.property) {
    tag.property = tag.property.replace('ogPrefix', config.ogPrefix);
  }
  if (tag.content) {
    tag.content = tag.content.toString().replace('ogPrefix', config.ogPrefix);
  }
  return tag;
}

function getImageMetaTag(src) {
  return {
    property: 'og:image',
    content: getVariation(src, 'large'),
  };
}

class Helmet extends Component {

  static propTypes = {
    appUrl: PropTypes.string,
    badge: PropTypes.number,
    currentLanguage: PropTypes.string,
    currentLocale: PropTypes.string,
    currentUrl: PropTypes.string,
    defaultTitle: PropTypes.string,
    description: PropTypes.string,
    hideBadge: PropTypes.bool,
    htmlAttributes: PropTypes.arrayOf(PropTypes.object),
    images: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.arrayOf(PropTypes.object),
    meta: PropTypes.array,
    rtl: PropTypes.bool,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    supportedLocales: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
  }

  static defaultProps = {
    images: [`${config.imagesPath}/opengraph-v2-1.png`],
    hideBadge: false,
  }

  render() {
    const url = `${config.siteUrl}${this.props.currentUrl}`.replace(/\/$/, '');

    // Basic meta tags
    let { title, description } = this.props;
    if (title && !this.props.hideBadge && this.props.badge > 0) {
      title = `(${this.props.badge}) ${title}`;
    }
    if (description) {
      description = description.substring(0, 160);
    }
    const base = [
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
      { name: 'title', content: title },
      { name: 'description', content: description },
      { name: 'keywords', content: 'shoutit' },
    ];

    const link = [
      ...this.props.link,
      { rel: 'canonical', href: url },
      { rel: 'shortcut icon', href: `${config.publicUrl}/images/favicons/favicon.ico` },
      { rel: 'apple-touch-icon', sizes: '256x256', href: `${config.publicUrl}/images/favicons/apple-touch-icon.png` },
    ];
    this.props.supportedLanguages
      .filter(language => language !== this.props.currentLanguage)
      .forEach(language =>
        link.push({
          rel: 'alternate',
          href: `${url}?hl=${language}`,
          hrefLang: language,
        }));


    // Open Graph
    const openGraph = [
      { property: 'fb:app_id', content: config.facebookId },
      { property: 'og:title', content: title || this.props.defaultTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: this.props.currentLocale, id: 'ogLocale' },
      { property: 'og:site_name', content: 'Shoutit' },
      { property: 'og:type', content: 'website' },
    ];
    this.props.supportedLocales
      .filter(locale => locale !== this.props.currentLocale)
      .forEach(locale => openGraph.push({ property: 'og:locale:alternate', content: locale }));

    // App links (the rest is added in Application.js)
    const appUrl = this.props.appUrl ?
      this.props.appUrl.replace('shoutit://', config.appProtocol) :
      `${config.appProtocol}home`;

    const appLinks = [
      { property: 'al:ios:app_store_id', content: config.iosAppId },
      { property: 'al:ios:app_name', content: config.iosAppName },
      { property: 'al:android:package', content: config.androidPackage },
      { property: 'al:android:app_name', content: config.androidAppName },
      { property: 'al:web:url', content: url },
      { property: 'al:ios:url', content: appUrl, id: 'shoutitAppUrl_ios' },
      { property: 'al:android:url', content: appUrl, id: 'shoutitAppUrl_android' },
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
    if (this.props.images.length > 2) {
      twitter.push({ name: 'twitter:card', content: 'gallery' });
    }
    const images = this.props.images.map(getImageMetaTag);
    const meta = union(
      base,
      images,
      openGraph,
      twitter,
      appLinks,
      this.props.meta,
    ).map(replaceOgPrefixForTag);

    let lang = this.props.currentLanguage;
    if (lang === 'ar') {
      // Make sure we use latin numbers in arabic
      lang = 'ar-u-nu-latn';
    }
    const htmlAttributes = {
      ...this.props.htmlAttributes,
      lang: this.props.currentLanguage,
      dir: this.props.rtl ? 'rtl' : 'ltr',
    };

    return (
      <ReactHelmet
        { ...this.props }
        meta={ meta }
        link={ link }
        htmlAttributes={ htmlAttributes }
      />
    );
  }
}

const messages = defineMessages({
  defaultTitle: {
    id: 'app.meta.title',
    defaultMessage: 'Buy and sell while chatting! - Shoutit',
  },
  description: {
    id: 'app.meta.description',
    defaultMessage: 'The fastest way to share and offer what you want to sell or buy. Take photos and videos and chat with buyers or sellers.',
  },
  titleTemplate: {
    id: 'app.meta.titleTemplate',
    defaultMessage: '%s - Shoutit',
  },
});

const mapStateToProps = (state, ownProps) => {
  const defaultTitle = ownProps.defaultTitle || ownProps.intl.formatMessage(messages.defaultTitle);
  const description = ownProps.description || ownProps.intl.formatMessage(messages.description);
  const titleTemplate = ownProps.titleTemplate || ownProps.intl.formatMessage(messages.titleTemplate);
  const badge = getUnreadNotificationsCount(state) + getUnreadConversationsCount(state);
  return {
    defaultTitle,
    badge,
    description,
    titleTemplate,
    currentLocale: getCurrentLocale(state),
    supportedLocales: getSupportedLocales(state),
    supportedLanguages: getSupportedLanguages(state),
    rtl: isRtl(state),
  };
};


const ConnectedHelmet = injectIntl(connect(mapStateToProps)(Helmet));
ConnectedHelmet.rewind = ReactHelmet.rewind;

export default ConnectedHelmet;
