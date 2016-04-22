import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Icon from '../ui/Icon';
import Button from '../ui/Button';
import ProfileAvatar from '../users/ProfileAvatar';

if (process.env.BROWSER) {
  require('../styles/components/HeaderProfile.scss');
}

export function HeaderProfile({
  user,
  onMessagesClick,
  onProfileClick,
  onNotificationsClick,
  onNewShoutClick,
}) {
  return (
    <div className="HeaderProfile">
      <div>
        <Link to="/messages" onClick={ onMessagesClick }>
          <Icon name="balloon-dots" badge={ user.stats.unreadConversationsCount } />
        </Link>
      </div>
      <div>
        <Icon name="bell" badge={ 0 } onClick={ onNotificationsClick } />
      </div>
      <div>
        <Button
          primary
          size="small"
          label="Create Shout"
          onClick={ onNewShoutClick }
          leftIcon={ <Icon name="sparkle" fill /> } />
      </div>
      <div>
          <Link
            className="HeaderProfile-profileLink"
            to={`/user/${user.username}`}
            onClick={ onProfileClick }>
              <ProfileAvatar user={ user } size="large" mask />
          </Link>
      </div>
    </div>
  );
}

HeaderProfile.propTypes = {
  user: PropTypes.object.isRequired,
  onMessagesClick: PropTypes.func,
  onNewShoutClick: PropTypes.func,
  onNotificationsClick: PropTypes.func,
  onProfileClick: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.session.user,
});

export default connect(mapStateToProps)(HeaderProfile);
