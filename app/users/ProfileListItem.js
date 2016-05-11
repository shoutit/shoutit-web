import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ProfileAvatar from '../users/ProfileAvatar';
import Popover from '../ui/Popover';
import ListItem from '../ui/ListItem';
import ProfilePreview from '../users/ProfilePreview';

export default function ProfileListItem({
  profile,
  size = 'medium',
  link = true,
  showName = true,
  onClick,
}) {

  const avatar = <ProfileAvatar size={ size } profile={ profile } />;
  const overlay = <ProfilePreview id={ profile.id } />;
  const content = (
    <ListItem className="ProfileListItem" size={ size } nowrap start={ avatar } onClick={ onClick }>
      { showName && profile.name }
    </ListItem>
  );

  if (!link) {
    return content;
  }
  return (
    <Popover overlay={ overlay } placement="right">
      { link ?
        <Link to={ `/user/${profile.username}` }>
          { content }
        </Link> :
        <span>{ content }</span>
      }
    </Popover>

  );
}

ProfileListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  showName: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  tooltipPlacement: PropTypes.string,
};
