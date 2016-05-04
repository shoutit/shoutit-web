import React, { PropTypes } from 'react';
import ReactHelmet from 'react-helmet';
import union from 'lodash/array/union';
import { connect } from 'react-redux';

import { getVariation } from '../utils/APIUtils';

export function Helmet({ title, badge = 0, description = '', images = [], meta, ...props }) {

  if (title && badge > 0) {
    title = `(${badge}) ${title}`;
  }
  if (description) {
    description = description.substring(0, 160);
  }
  const otherMeta = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ];
  if (images.length > 2) {
    otherMeta.push({ name: 'twitter:card', content: 'gallery' });
  }
  const imagesMeta = images.map(src =>
    ({ property: 'og:image', content: getVariation(src, 'large') }),
  );

  meta = union(meta, otherMeta, imagesMeta);
  return <ReactHelmet {...props} title={ title } meta={ meta } />;
}

Helmet.propTypes = {
  ...ReactHelmet.propTypes,
  title: PropTypes.string,
  description: PropTypes.string,
  badge: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
  badge: state.session.user ? state.entities.users[state.session.user].stats.unreadConversationsCount : 0,
});

const ConnectedHelmet = connect(mapStateToProps)(Helmet);
ConnectedHelmet.rewind = ReactHelmet.rewind;

export default ConnectedHelmet;
