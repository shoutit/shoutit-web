import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

export default function InterestListItem({ tag, size = 'medium' }) {
  return (
    <Link className="InterestListItem" to={ `/interest/${tag.name}` }>
      <ListItem size={size} nowrap start={ <SVGIcon size={ size } name="tag" active /> }>
        { tag.name }
      </ListItem>
    </Link>
  );
}

InterestListItem.PropTypes = {
  tag: PropTypes.object.isRequired,
};
