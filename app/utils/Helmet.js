import React, { PropTypes, Component } from 'react';
import ReactHelmet from 'react-helmet';
import { injectIntl, defineMessages } from 'react-intl';
import union from 'lodash/union';
import { connect } from 'react-redux';
import { ogPrefix, imagesPath } from '../config';

import { getUnreadNotificationsCount, getUnreadConversationsCount } from '../reducers/session';
import { getVariation } from '../utils/APIUtils';

class Helmet extends Component {

  static propTypes = {
    ...ReactHelmet.propTypes,
    title: PropTypes.string,
    meta: PropTypes.array,
    description: PropTypes.string,
    badge: PropTypes.number,
    hideBadge: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    images: [`${imagesPath}/opengraph-v2-1.png`],
    hideBadge: false,
  }

  render() {
    let { title, description } = this.props;
    if (title && !this.props.hideBadge && this.props.badge > 0) {
      title = `(${this.props.badge}) ${title}`;
    }
    if (description) {
      description = description.substring(0, 160);
    }
    const otherMeta = [
        { name: 'description', content: description },
        { property: 'og:title', content: title || this.props.defaultTitle },
        { property: 'og:description', content: description },
    ];
    if (this.props.images.length > 2) {
      otherMeta.push({ name: 'twitter:card', content: 'gallery' });
    }
    const imagesMeta = this.props.images.map(src =>
        ({ property: 'og:image', content: getVariation(src, 'large') }),
      );

    const meta = union(this.props.meta, otherMeta, imagesMeta).map(tag => {
      if (tag.property) {
        tag.property = tag.property.replace('ogPrefix', ogPrefix);
      }
      if (tag.content) {
        tag.content = tag.content.toString().replace('ogPrefix', ogPrefix);
      }
      return tag;
    });
    return <ReactHelmet { ...this.props } title={ title } meta={ meta } />;
  }
}

const mapStateToProps = (state, ownProps) => {
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
  const defaultTitle = ownProps.defaultTitle || ownProps.intl.formatMessage(messages.defaultTitle);
  const description = ownProps.description || ownProps.intl.formatMessage(messages.description);
  const titleTemplate = ownProps.titleTemplate || ownProps.intl.formatMessage(messages.titleTemplate);
  const badge = getUnreadNotificationsCount(state) + getUnreadConversationsCount(state);
  return { defaultTitle, badge, description, titleTemplate };
};


const ConnectedHelmet = injectIntl(connect(mapStateToProps)(Helmet));
ConnectedHelmet.rewind = ReactHelmet.rewind;

export default ConnectedHelmet;
