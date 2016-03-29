import React from 'react';
import { connect } from 'react-redux';

import Header from '../layout/Header';
import MainPage from '../shared/components/main/mainPage.jsx';
import UINotificationsHost from '../ui/UINotificationsHost';
import VideoCallHost from '../videoCalls/VideoCallHost';

import { getCurrentSession, login } from '../actions/session';
import { loadCategories, loadCurrencies } from '../actions/misc';
import { getCurrentLocation, loadSuggestions } from '../actions/location';

const pagesWithoutHeader = [MainPage];

if (process.env.BROWSER) {
  require('./Application.scss');
}

const fetchData = (store) => {
  const promises = [];

  promises.push(store.dispatch(loadCategories()));
  promises.push(store.dispatch(loadCurrencies()));

  promises.push(
    store.dispatch(getCurrentSession()).then(user => {
      const sessionPromises = [];
      if (user) {
        sessionPromises.push(store.dispatch(login(user)));
      }
      if (!user || !user.location) {
        sessionPromises.push(store.dispatch(getCurrentLocation()));
      }
      return Promise.all(sessionPromises);
    })
  );

  return Promise.all(promises);
};

export class Application extends React.Component {

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, currentLocation, loggedUser } = this.props;
    if (loggedUser) {
      dispatch(login(loggedUser)); // trigger client-side login actions (e.g. pusher)
    }
    dispatch(loadSuggestions(currentLocation));
  }

  componentDidUpdate(prevProps) {
    const { dispatch, currentLocation } = this.props;
    const { loggedUser } = this.props;
    const hasBeenLoggedIn = !prevProps.loggedUser && loggedUser;

    if (currentLocation.slug !== prevProps.currentLocation.slug) {
      dispatch(loadSuggestions(currentLocation));
    }

    if (hasBeenLoggedIn) {
      // actions.initTwilio();
    }
  }

  render() {
    const { children, ...props } = this.props;

    const hideHeader = this.props.routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );

    return (
      <div className={`App${hideHeader ? '' : ' stickyHeader'}` }>
        { !hideHeader &&
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
          { React.cloneElement(children, props) }
        </div>
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
  };
}

export default connect(mapStateToProps)(Application);
