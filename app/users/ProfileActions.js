import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { listenToUser, stopListeningToUser } from '../actions/users';
import { startConversation, openConversation } from '../actions/conversations';
import { Link } from 'react-router';

import RequiresLogin from '../auth/RequiresLogin';
import { START_LISTENING, SEND_MESSAGE } from '../auth/loginActions';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import { getLoggedUser } from '../reducers/session';

import './ProfileActions.scss';
export function ProfileActions({ profile, loggedUser, dispatch, size = 'medium', showProfileLink = false }) {

  if (profile.isOwner && !showProfileLink) {
    return <div />;
  }

  const onListenClick = () => {
    if (profile.isListening) {
      dispatch(stopListeningToUser(loggedUser, profile));
    } else {
      dispatch(listenToUser(loggedUser, profile));
    }
  };

  const onSendMessageClick = () => {
    if (profile.conversation) {
      dispatch(openConversation(profile.conversation));
    } else {
      dispatch(startConversation(loggedUser, profile));
    }
  };

  return (
    <div className="ProfileActions">
      { profile.isListener &&
        <p className="ProfileActions-is-listener">
          <FormattedMessage
            id="profileActions.userIsListening"
            defaultMessage="{firstName} is listening to you"
            values={ { ...profile } }
          />
        </p>
      }
      <ul className="htmlNoList">
        { !profile.isOwner && profile.isListener &&
          <li>
            <RequiresLogin event="onClick" loginAction={ SEND_MESSAGE } redirectUrl={ `/user/${profile.username}` }>
              <ListItem
                size={ size }
                onClick={ onSendMessageClick }
                start={ <Icon size={ size } active name="balloon-dots" /> }>
                <FormattedMessage
                  id="profileActions.sendMessage"
                  defaultMessage="Send {firstName} a message"
                  values={ { ...profile } }
                />
              </ListItem>
            </RequiresLogin>
          </li>
        }
        { !profile.isOwner &&
          <li>
            <RequiresLogin event="onClick" loginAction={ START_LISTENING } redirectUrl={ `/user/${profile.username}` }>
              <ListItem
                size={ size }
                onClick={ onListenClick }
                start={ <Icon size={ size } name="listen" active={ !profile.isListening } on={ profile.isListening } /> }
              >
                <FormattedMessage
                  id="profileActions.listen"
                  defaultMessage="{isListening, select,
                    true {Stop listening to {firstName}}
                    false {Listen to {firstName}}
                  }"
                  values={ { ...profile } }
                />
              </ListItem>
            </RequiresLogin>
          </li>
        }
        { showProfileLink &&
          <li>
            <Link to={ `/user/${profile.username}` }>
              <ListItem size={ size } start={ <Icon active size={ size } name="profile" /> }>
                <FormattedMessage
                  id="profileActions.viewProfile"
                  defaultMessage="View profile"
                />
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
  loggedUser: PropTypes.object,
  showProfileLink: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const mapStateToProps = state => ({
  loggedUser: getLoggedUser(state),
});

export default connect(mapStateToProps)(ProfileActions);
