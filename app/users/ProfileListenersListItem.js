import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

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
      { type === 'listeners' ?
        <FormattedMessage id="profile.listeners"
          defaultMessage="{count, select,
            =0 {No listeners}
            one {# listener}
            two {# listeners}
            other {# listening}
          }"
          values={ { count } }
        /> :
        <FormattedMessage id="profile.listening"
          defaultMessage="{count, select,
            =0 {No listening}
            one {# listening}
            two {# listening}
            other {# listening}
          }"
          values={ { count } }
        />
      }
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
