import React from "react";
import { connect } from "react-redux";

import Header from "../layout/Header";
import MainPage from "../shared/components/main/mainPage.jsx";
import UINotificationsHost from "../ui/UINotificationsHost";
import VideoCallHost from "../videoCalls/VideoCallHost";

import { getCurrentSession, login } from "../actions/session";
import { loadCategories, loadCurrencies } from "../actions/misc";
import { getCurrentLocation, loadSuggestions } from "../actions/location";

const pagesWithoutHeader = [ MainPage ];

if (process.env.BROWSER) {
  require("./Application.scss");
}

const fetchData = (store) => {
  const promises = [];

  promises.push(store.dispatch(loadCategories()));
  promises.push(store.dispatch(loadCurrencies()));

  promises.push(
    store.dispatch(getCurrentSession()).then(user => {
      const promises = [];
      if (user) {
        promises.push(store.dispatch(login(user)));
      }
      if (!user || !user.location) {
        promises.push(store.dispatch(getCurrentLocation()));
      }
      return Promise.all(promises);
    })
  );

  return Promise.all(promises);
};

export class Application extends React.Component {

  componentDidMount() {
    const { dispatch, currentLocation, loggedUser } = this.props;
    dispatch(loadSuggestions(currentLocation));
    if (loggedUser) {
      dispatch(login(loggedUser)); // trigger client-side login actions (e.g. pusher)
    }
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

  static fetchData = fetchData;

  render() {
    const { children, ...props } = this.props;

    const hideHeader = this.props.routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );

    return (
      <div className={`App${hideHeader ? "" : " stickyHeader"}` }>
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
        <UINotificationsHost
          notifications={ this.props.uiNotifications }
          flux={ props.flux }
        />
        { props.videoCallState && props.videoCallState.currentConversation &&
          <VideoCallHost conversation={ props.videoCallState.currentConversation } /> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { entities } = state;
  return {
    categories: state.misc.categories.ids.map(id => entities.categories[id]),
    shuffledCategories: state.shuffledCategories.map(id => entities.categories[id]),
    currencies: state.misc.currencies.ids.map(id => entities.currencies[id]),
    currentLocation: state.currentLocation,
    uiNotifications: state.uiNotifications,
    loggedUser: state.session.user
  };
}

export default connect(mapStateToProps)(Application);
