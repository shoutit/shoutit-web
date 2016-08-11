import React, { PropTypes } from 'react';
import ReactHelmet from 'react-helmet';
import { injectIntl, defineMessages } from 'react-intl';
import union from 'lodash/union';
import { connect } from 'react-redux';

import * as config from '../config';
import { getVariation } from '../utils/APIUtils';

import {
  getUnreadNotificationsCount,
  getUnreadConversationsCount,
} from '../reducers/session';

function replaceOgPrefixForTag(tag) {
  if (tag.property) {
    tag.property = tag.property.replace('ogPrefix', config.ogPrefix);
  }
  if (tag.content) {
    tag.content = tag.content.toString().replace('ogPrefix', config.ogPrefix);
  }
  return tag;
}

const defaultImages = [`${config.imagesPath}/opengraph-v2-1.png`];
/**
 * Shortcut component for setting the React Helmet. Images, title and description will
 * be parsed to produce the related meta tags.
 * To include the default meta tags in the application, use ApplicationHelmet.
 *
 * @export
 * @param {Object} {
 *   title,
 *   description,
 *   defaultTitle,
 *   hideBadge = false,
 *   badge = 0,
 *   appUrl,
 *   images,
 *   meta = [],
 * }
 * @returns
 */
export function Helmet({
  title,
  defaultTitle,
  hideBadge = false,
  badge = 0,
  description,
  appUrl,
  images,
  meta = [],
}) {
  if (!title) {
    title = defaultTitle;
  }
  if (title && !hideBadge && badge > 0) {
    title = `(${badge}) ${title}`;
  }
  if (description) {
    description = description.substring(0, 160);
  }
  if (!images || images.length === 0) {
    images = defaultImages;
  }

  const baseMetaTags = [
    { name: 'title', content: title },
    { name: 'description', content: description },
    { name: 'keywords', content: 'shoutit' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...meta,
  ];

  appUrl = appUrl ?
    appUrl.replace('shoutit://', config.appProtocol) :
    `${config.appProtocol}home`;

  const appLinks = [
    { property: 'al:ios:url', content: appUrl, id: 'shoutitAppUrl_ios' },
    { property: 'al:android:url', content: appUrl, id: 'shoutitAppUrl_android' },
    { name: 'twitter:app:url:iphone', content: appUrl },
    { name: 'twitter:app:url:ipad', content: appUrl },
    { name: 'twitter:app:url:googleplay', content: appUrl },
  ];

  const imagesMetaTags = images.map(src => ({
    property: 'og:image',
    content: getVariation(src, 'large'),
  }));
  images.forEach(src => imagesMetaTags.push({
    name: 'twitter:image',
    content: getVariation(src, 'large'),
  }));
  if (imagesMetaTags.length > 2) {
    imagesMetaTags.push({ name: 'twitter:card', content: 'gallery' });
  }
  const metaTags = union(baseMetaTags, imagesMetaTags, appLinks).map(replaceOgPrefixForTag);

  return <ReactHelmet meta={ metaTags } title={ title } />;
}

Helmet.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  appUrl: PropTypes.string,
  hideBadge: PropTypes.bool,

  badge: PropTypes.number,
  defaultTitle: PropTypes.string.isRequired,
  meta: PropTypes.array,
  rtl: PropTypes.bool,
};

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

const mapStateToProps = (state, ownProps) => ({
  titleTemplate: ownProps.titleTemplate || ownProps.intl.formatMessage(messages.titleTemplate),
  defaultTitle: ownProps.defaultTitle || ownProps.intl.formatMessage(messages.defaultTitle),
  badge: getUnreadNotificationsCount(state) + getUnreadConversationsCount(state),
  description: ownProps.description || ownProps.intl.formatMessage(messages.description),
});

const ConnectedHelmet = injectIntl(connect(mapStateToProps)(Helmet));
ConnectedHelmet.rewind = ReactHelmet.rewind;

export default ConnectedHelmet;
