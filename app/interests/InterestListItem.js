import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SVGIcon from '../ui/SVGIcon';

if (process.env.BROWSER) {
  require('./TagListItem.scss');
}
export default function TagListItem({ tag }) {
  return (
    <Link className="TagListItem" to={ `/interest/${tag.name}` }>
      <SVGIcon name="tag" active /> { tag.name }
    </Link>
  );
}

TagListItem.PropTypes = {
  tag: PropTypes.object.isRequired,
};
