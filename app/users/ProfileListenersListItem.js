import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import { openModal } from '../actions/ui';
import ListenersScrollableList from '../users/ListenersScrollableList';

export function ProfileListenersListItem({ type = 'listeners', profile, onClick, size = 'small' }) {
  let count;
  let label;
  if (type === 'listeners') {
    count = profile.listenersCount;
    label = `${count === 0 ? 'No ' : count} listener${count > 1 ? 's' : ''}`;
  } else {
    count = profile.listeningCount.users;
    label = `${count === 0 ? 'No ' : count} listening`;
  }
  return (
    <ListItem
      className="ProfileListenersListItem"
      size={ size }
      nowrap
      onClick={ count > 0 ? onClick : undefined }
      start={ <Icon name={ type } size={ size } active={ count > 0 } /> }>
      { label }
    </ListItem>
  );
}

ProfileListenersListItem.propTypes = {
  type: PropTypes.oneOf(['listeners', 'listening']),
  profile: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};

const mapDispatchToProps = (dispatch, { profile, type = 'listeners' }) => ({
  onClick: () => {
    let title;
    if (type === 'listeners') {
      title = `Profiles listening to ${profile.firstName}`;
    } else {
      title = `Profiles ${profile.firstName} is listening to`;
    }
    dispatch(openModal(
      <ListenersScrollableList type={ type } profile={ profile } />,
      { title, scrollableBody: true, bsSize: 'small' }
    ));
  },
});
export default connect(null, mapDispatchToProps)(ProfileListenersListItem);
