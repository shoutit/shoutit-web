import React from 'react';
import { connect } from 'react-redux';

import Header from '../layout/Header';
import UINotificationsHost from '../ui/UINotificationsHost';
import ModalHost from '../ui/ModalHost';
import VideoCallHost from '../videoCalls/VideoCallHost';

import { login } from '../actions/session';
import { loadCategories, loadCurrencies } from '../actions/misc';
import { loadCurrentLocation, loadSuggestions } from '../actions/location';
import { loadListening } from '../actions/users';

if (process.env.BROWSER) {
  require('normalize.css/normalize.css');
  require('./Application.scss');
}

const fetchData = store => {
  const promises = [];
  const { dispatch } = store;
  promises.push(dispatch(loadCategories()));
  promises.push(dispatch(loadCurrencies()));
  const user = store.getState().session.user; // logged user comes from rehydrated state
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
    const { dispatch, currentLocation, loggedUser, firstRender } = this.props;
    if (loggedUser) {
      dispatch(login(loggedUser)); // trigger client-side login actions (e.g. pusher)
    }
    if (!firstRender) {
      dispatch(loadSuggestions(currentLocation));
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, currentLocation } = this.props;

    if (currentLocation.slug !== nextProps.currentLocation.slug) {
      dispatch(loadSuggestions(currentLocation));
    }
  }

  render() {
    const { children, ...props } = this.props;
    let className = 'App';

    if (!(!props.loggedUser && props.currentUrl === '/')) {
      className += ' stickyHeader';
    }

    const lastRoute = props.routes[props.routes.length - 1];
    if (lastRoute.getApplicationLayout) {
      const layout = lastRoute.getApplicationLayout();
      if (layout.className) {
        className += ` ${layout.className}`;
      }
    }
    return (
      <div className={ className }>
        <div className="App-header">
          <Header
            history={ props.history }
            flux={ props.flux }
            chat={ props.chat }
            conversations={ props.conversations }
            location={ props.location }
          />
        </div>
        <div className="App-content">
          { React.cloneElement(children, props) }
        </div>
        <ModalHost />
        <UINotificationsHost />
        { props.videoCallState && props.videoCallState.currentConversation &&
          <VideoCallHost conversation={ props.videoCallState.currentConversation } /> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedUser: state.session.user,
    currentLocation: state.currentLocation,
    currentUrl: state.routing.currentUrl,
  };
}

export default connect(mapStateToProps)(Application);
