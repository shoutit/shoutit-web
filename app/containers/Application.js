import React from 'react';
import { connect } from 'react-redux';

import Header from '../layout/Header';
import UINotificationsHost from '../ui/UINotificationsHost';
import ModalHost from '../ui/ModalHost';
import VideoCallHost from '../videoCalls/VideoCallHost';
import ConversationsHost from '../chat/ConversationsHost';
import ServerError from './ServerError';
import NotFound from './NotFound';

import { login } from '../actions/session';
import { loadCategories, loadCurrencies } from '../actions/misc';
import { loadCurrentLocation, loadSuggestions } from '../actions/location';
import { loadListening } from '../actions/users';

if (process.env.BROWSER) {
  require('normalize.css/normalize.css');
  require('./Application.scss');
}

const fetchData = (dispatch, state) => {
  const promises = [];
  promises.push(dispatch(loadCategories()));
  promises.push(dispatch(loadCurrencies()));
  const user = state.session.user; // logged user comes from rehydrated state
  if (user) {
    promises.push(dispatch(login(user)));
    promises.push(dispatch(loadListening(user)));
    if (user.location) {
      promises.push(dispatch(loadSuggestions(user.location)));
    }
  }
  if (!user || !user.location) {
    promises.push(
      dispatch(loadCurrentLocation()).then(payload =>
        dispatch(loadSuggestions(payload.location))
      )
    );
  }
  return Promise.all(promises);
};

export class Application extends React.Component {

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, loggedUser } = this.props;
    if (loggedUser) {
      dispatch(login(loggedUser)); // trigger client-side login actions (e.g. pusher)
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, currentLocation, loggedUser } = this.props;

    // Update suggestions if location change
    if (currentLocation.slug !== nextProps.currentLocation.slug) {
      dispatch(loadSuggestions(currentLocation));
    }
    if (!nextProps.loggedUser && loggedUser) {
      // Fetch application data again when logged user changed (e.g. has been logged out)
      fetchData(dispatch, { session: { user: undefined } });
    }
  }

  render() {
    const { children, error, ...props } = this.props;
    let className = 'App';
    let stickyHeader = true;
    let showHeader = (!error || error.statusCode === 404);

    if (props.routes) {
      const lastRoute = props.routes[props.routes.length - 1];
      if (lastRoute.getApplicationLayout) {
        const layout = lastRoute.getApplicationLayout();
        if (layout.className) {
          className += ` ${layout.className}`;
        }
        showHeader = !layout.hideHeader;
        stickyHeader = layout.stickyHeader;
      }
    }

    if (showHeader && stickyHeader) {
      className += ' stickyHeader';
    }

    return (
      <div className={ className }>
        { showHeader &&
          <div className="App-header">
            <Header
              history={ props.history }
              flux={ props.flux }
              chat={ props.chat }
              conversations={ props.conversations }
              location={ props.location }
            />
          </div>
        }
        <div className="App-content">
          { !error ? // eslint-disable-line
            React.cloneElement(children, props) :
            (error.statusCode === 404 ?
            <NotFound /> :
            <ServerError error={ error } />)
          }
        </div>
        <ModalHost />
        <UINotificationsHost />
        { props.videoCallState && props.videoCallState.currentConversation &&
          <VideoCallHost conversation={ props.videoCallState.currentConversation } /> }
        <ConversationsHost />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedUser: state.session.user,
    currentLocation: state.currentLocation,
    currentUrl: state.routing.currentUrl,
    error: state.routing.error,
  };
}

export default connect(mapStateToProps)(Application);
