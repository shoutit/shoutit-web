import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import ListenersModal from '../users/ListenersModal';

import { openModal } from '../actions/ui';

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
  onClick: () => dispatch(openModal(
    <ListenersModal type={ type } profile={ profile } />
  )),
});
export default connect(null, mapDispatchToProps)(ProfileListenersListItem);
