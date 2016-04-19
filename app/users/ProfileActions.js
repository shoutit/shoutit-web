import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { listenToUser, stopListeningToUser } from '../actions/users';
import { startConversation } from '../actions/chat';
import { Link } from 'react-router';

import RequiresLogin from '../auth/RequiresLogin';
import { START_LISTENING, SEND_MESSAGE } from '../auth/loginActions';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

if (process.env.BROWSER) {
  require('./ProfileActions.scss');
}
export function ProfileActions({ profile, loggedUser, dispatch, isUpdatingListening, size = 'medium', showProfileLink = false }) {

  if (profile.isOwner && !showProfileLink) {
    return <div />;
  }

  const onListenClick = () => {
    if (isUpdatingListening) {
      return;
    }
    if (profile.isListening) {
      dispatch(stopListeningToUser(loggedUser, profile));
    } else {
      dispatch(listenToUser(loggedUser, profile));
    }
  };

  const onSendMessageClick = () => {
    dispatch(startConversation(loggedUser, profile));
  };

  return (
      <div className="ProfileActions">
        <ul className="htmlNoList">
          { !profile.isOwner &&
            <li>
              <RequiresLogin event="onClick" loginAction={ START_LISTENING } redirectUrl={ `/user/${profile.username}` }>
                <ListItem
                  size={ size }
                  disabled={ isUpdatingListening }
                  onClick={ onListenClick }
                  start= { <Icon size={ size } name="listen" active={ !profile.isListening } on={ profile.isListening } /> }
                >
                  { profile.isListening ? `Stop listening to ${profile.firstName}` : `Listen to ${profile.firstName}` }
                </ListItem>
              </RequiresLogin>
            </li>
          }
          { !profile.isOwner &&
            <li>
              <RequiresLogin event="onClick" loginAction={ SEND_MESSAGE } redirectUrl={ `/user/${profile.username}` }>
                <ListItem size={ size }
                  onClick={ onSendMessageClick }
                  start= { <Icon size={ size } active name="balloon-dots" /> }>
                  Send {profile.firstName} a message
                </ListItem>
              </RequiresLogin>
            </li>
          }
          { showProfileLink &&
            <li>
              <Link to={`/user/${profile.username}`}>
                <ListItem
                  size={ size }
                  start= { <Icon active size={ size } name="profile" /> }
                >
                  View profile
                </ListItem>
              </Link>
            </li>
          }
        </ul>
    </div>
  );
}

ProfileActions.propTypes = {
  profile: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isUpdatingListening: PropTypes.bool,
  loggedUser: PropTypes.object,
  showProfileLink: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const mapStateToProps = (state, ownProps) => {
  const { session: { user: loggedUser }, paginated: { listenersByUser } } = state;
  return {
    loggedUser,
    isUpdatingListening: listenersByUser[ownProps.profile.id] ? listenersByUser[ownProps.profile.id].isUpdating : false,
  };
};

export default connect(mapStateToProps)(ProfileActions);
