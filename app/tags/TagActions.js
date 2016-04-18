import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import { listenToTag, stopListeningToTag } from '../actions/tags';
import { Link } from 'react-router';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';

export function TagActions({ tag, loggedUser, dispatch, isUpdatingListening, size = 'medium', showProfileLink = false }) {
  //
  // const onListenClick = () => {
  //   if (isUpdatingListening) {
  //     return;
  //   }
  //   if (!loggedUser) {
  //     dispatch((push('/login')));
  //     return;
  //   }
  //   if (tag.isListening) {
  //     dispatch(stopListeningToTag(loggedUser, tag));
  //   } else {
  //     dispatch(listenToTag(loggedUser, tag));
  //   }
  // };

  return (
      <div className="TagActions">
        <ul className="htmlNoList">
          {/*<li>
            <ListItem
              size={ size }
              disabled={ isUpdatingListening }
              onClick={ onListenClick }
              start= { <Icon size={ size } name="listen" active={ !tag.isListening } on={ tag.isListening } /> }
            >
              { tag.isListening ? `Stop listening to ${tag.name}` : `Listen to ${tag.name}` }
            </ListItem>
          </li>*/}
          <li>
            <Link to={`/interest/${tag.name}`}>
              <ListItem
                size={ size }
                start= { <Icon active size={ size } name="tag" /> }
              >
                View Shouts
              </ListItem>
            </Link>
          </li>
        </ul>
    </div>
  );
}

TagActions.propTypes = {
  tag: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isUpdatingListening: PropTypes.bool,
  loggedUser: PropTypes.object,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const mapStateToProps = (state, ownProps) => {
  // const { paginated: { listenersByUser } } = state;
  return {
    loggedUser: state.session.user,
    // isUpdatingListening: listenersByUser[ownProps.profile.id] ? listenersByUser[ownProps.profile.id].isUpdating : false,
  };
};

export default connect(mapStateToProps)(TagActions);
