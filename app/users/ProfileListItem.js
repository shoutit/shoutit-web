import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import UserAvatar from '../users/UserAvatar';
import Tooltip from '../ui/Tooltip';
import ListItem from '../ui/ListItem';
import ProfileOverlay from '../users/ProfileOverlay';

export default function ProfileListItem({
  profile,
  size = 'medium',
  link = true,
  showName = true,
  onClick,
  tooltipPlacement = 'right',
}) {

  const avatar = <UserAvatar size={ size } user={ profile } />;
  const overlay = <ProfileOverlay id={ profile.id } />;
  const content = (

      <ListItem className="ProfileListItem" size={ size } nowrap start={ avatar } onClick={ onClick }>
        { showName && profile.name }
      </ListItem>
  );

  if (!link) {
    return content;
  }
  return (
    <Tooltip
      destroyTooltipOnHide
      white
      placement={ tooltipPlacement }
      overlay={ overlay }
      getTooltipContainer={ c => c.parentNode }>
      { link ?
        <Link to={ `/user/${profile.username}` }>
          { content }
        </Link> :
        <span>{ content }</span>
      }
    </Tooltip>

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
