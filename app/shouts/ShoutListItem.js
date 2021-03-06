import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ShoutPrice from '../shouts/ShoutPrice';

import ListItem from '../layout/ListItem';
import { backgroundImageStyle } from '../utils/DOMUtils';

import './ShoutListItem.scss';

export default function ShoutListItem({
  shout,
  size = 'medium',
  link = true,
  onClick,
}) {
  const thumbnail = (
    <span
      className="ShoutListItem-thumbnail"
      style={ backgroundImageStyle({ url: shout.thumbnail, variation: 'small' }) }
    />
  );
  let content = (
    <ListItem className="ShoutListItem" size={ size } nowrap start={ thumbnail } onClick={ onClick }>
      <div className="ShoutListItem-child">
        <div className="ShoutListItem-title">{ shout.title }</div>
        <div className="ShoutListItem-details">
          <ShoutPrice shout={ shout } />
        </div>
      </div>
    </ListItem>
  );
  if (link) {
    content = (
      <Link to={ `/shout/${shout.id}` }>
        { content }
      </Link>
    );
  }
  return content;
}

ShoutListItem.propTypes = {
  shout: PropTypes.object.isRequired,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
