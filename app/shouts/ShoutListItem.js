import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ProfileAvatar from '../users/ProfileAvatar';
import ListItem from '../ui/ListItem';
import { formatLocation } from '../utils/LocationUtils';

if (process.env.BROWSER) {
  // require('./ShoutListItem.scss');
}

export default function ShoutListItem({
  shout,
  size = 'medium',
  link = true,
  onClick,
}) {

  const avatar = <ProfileAvatar size={ size } shout={ shout } />;
  let content = (
    <ListItem className="ShoutListItem" size={ size } nowrap start={ avatar } onClick={ onClick }>
      <div className="ShoutListItem-child">
        <div className="ShoutListItem-name">{ shout.name }</div>
        { size === 'large' && shout.title &&
          <div className="ShoutListItem-ancillary">
            { formatLocation(shout.title) }
          </div>
        }
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
