import React, { PropTypes } from 'react';
import { Link } from 'react-router';

// Render a link to a shout, can be extended to create a seo-friendly slug
export default function ShoutLink({ shout, children, ...props }) {
  return (
    <Link to={ `/shout/${shout.id}` } { ... props }>
      { children }
    </Link>
  );
}

ShoutLink.propTypes = {
  shout: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
