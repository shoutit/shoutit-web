import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';
import ProfileAvatar from '../users/ProfileAvatar';
import Popover from '../widgets/Popover';
import ListItem from '../layout/ListItem';
import ProfilePreview from '../users/ProfilePreview';
import { formatLocation } from '../utils/LocationUtils';

import './ProfileListItem.scss';

export function ProfileListItem({
  profile,
  size = 'medium',
  link = true,
  popover = true,
  showName = true,
  onClick,
  language,
}) {

  const avatar = <ProfileAvatar size={ size } profile={ profile } />;
  let content = (
    <ListItem
      className="ProfileListItem"
      size={ size }
      nowrap
      start={ avatar }
      onClick={ onClick }>
      <div className="ProfileListItem-child">
        <div className="ProfileListItem-name">{ showName && profile.name }</div>
        { size === 'large' && profile.location &&
          <div className="ProfileListItem-ancillary">
            { formatLocation(profile.location, {
              language,
            }) }
          </div>
        }
      </div>
    </ListItem>
  );
  if (link) {
    content = (
      <Link to={ `/user/${profile.username}` }>
        { content }
      </Link>
    );
  }
  if (popover) {
    const overlay = <ProfilePreview id={ profile.id } />;
    content = (
      <Popover overlay={ overlay } placement="right">
        { content }
      </Popover>
    );
  }
  return content;
}

ProfileListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  showName: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  tooltipPlacement: PropTypes.string,
};


const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});

export default connect(mapStateToProps)(ProfileListItem);
