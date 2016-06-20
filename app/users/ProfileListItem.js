import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import ProfileAvatar from '../users/ProfileAvatar';
import Popover from '../ui/Popover';
import ListItem from '../ui/ListItem';
import ProfilePreview from '../users/ProfilePreview';
import { formatLocation } from '../utils/LocationUtils';

if (process.env.BROWSER) {
  require('./ProfileListItem.scss');
}

export function ProfileListItem({
  profile,
  size = 'medium',
  link = true,
  popover = true,
  showName = true,
  onClick,
  locale,
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
              locale,
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
  locale: PropTypes.string.isRequired,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  showName: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  tooltipPlacement: PropTypes.string,
};


const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(ProfileListItem);
