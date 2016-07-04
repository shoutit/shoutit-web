import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Icon from '../widgets/Icon';
import ListItem from '../layout/ListItem';
import ListenersModal from '../users/ListenersModal';

import { openModal } from '../actions/ui';

export function ProfileListenersListItem({ type = 'listeners', profile, onClick, size = 'small' }) {
  let count;
  if (type === 'listeners') {
    count = profile.listenersCount;
  } else {
    count = profile.listeningCount.users;
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
          defaultMessage="{count, plural,
            =0 {No listeners}
            one {# listener}
            two {# listeners}
            other {# listening}
          }"
          values={ { count } }
        /> :
        <FormattedMessage id="profile.listening"
          defaultMessage="{count, plural,
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
