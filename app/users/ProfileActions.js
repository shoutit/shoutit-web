import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { listenToUser, stopListeningToUser } from '../actions/users';
import { Link } from 'react-router';

import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';

if (process.env.BROWSER) {
  require('./ProfileActions.scss');
}
export function ProfileActions({ profile, loggedUser, dispatch, isUpdatingListening, size = 'medium', showProfileLink = false }) {
  const onListenClick = () => {
    if (isUpdatingListening) {
      return;
    }
    if (!loggedUser) {
      dispatch((push(`/login?after=/user/${profile.username}&login_action=start_listening`)));
      return;
    }
    if (profile.isListening) {
      dispatch(stopListeningToUser(loggedUser, profile));
    } else {
      dispatch(listenToUser(loggedUser, profile));
    }
  };
  return (
      <div className="ProfileActions">
        <ul className="htmlNoList">
          <li>
            <ListItem
              size={ size }
              disabled={ isUpdatingListening }
              onClick={ e => onListenClick(e) }
              start= { <SVGIcon size={ size } name="listen" active={ !profile.isListening } on={ profile.isListening } /> }
            >
              { profile.isListening ? `Stop listening to ${profile.firstName}` : `Listen to ${profile.firstName}` }
            </ListItem>
          </li>
          <li>
            <ListItem size={ size } onClick={ () => {} } start= { <SVGIcon size={ size } active name="balloon-dots" /> }>
              Send {profile.firstName} a message
            </ListItem>
          </li>
          { showProfileLink &&
            <li>
              <Link to={`/user/${profile.username}`}>
                <ListItem
                  size={ size }
                  start= { <SVGIcon active size={ size } name="profile" /> }
                >
                  Visit profile
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
};

const mapStateToProps = (
  { session: { user: loggedUser }, paginated: { listenersByUser } },
ownProps) => ({
  loggedUser,
  isUpdatingListening: listenersByUser[ownProps.profile.id] ? listenersByUser[ownProps.profile.id].isUpdating : false,
});

export default connect(mapStateToProps)(ProfileActions);
