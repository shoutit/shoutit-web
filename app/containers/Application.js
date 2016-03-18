import React from "react";

import { ConnectToStores } from "../utils/FluxUtils";

import Header from "../shared/components/header";
import MainPage from "../shared/components/main/mainPage.jsx";
import UINotificationsHost from "../ui/UINotificationsHost";
import VideoCallHost from "../videoCalls/VideoCallHost";

const pagesWithoutHeader = [ MainPage ];

if (process.env.BROWSER) {
  require("./Application.scss");
}

const listenToStores = [
  "auth",
  "ui_notifications",
  "videocall",
  "conversations",
  "SuggestionsByLocationStore"
];

const fetchData = (flux, params, query, done) => {

  flux.actions.getCurrentSession((err, user) => {

    const promises = [];

    promises.push(new Promise(resolve => flux.actions.loadCurrencies(resolve)));
    promises.push(new Promise(resolve => flux.actions.loadCategories(resolve)));

    if (user) {
      promises.push(new Promise(resolve => flux.actions.loadConversations(resolve)));
      promises.push(new Promise(resolve => flux.actions.loadListeners(user, resolve)));
      promises.push(new Promise(resolve => flux.actions.loadListening(user, "users", resolve)));
    }

    // Load current location and suggestions based on the current location
    if (!user || !user.location) {
      promises.push(new Promise(resolve => {
        flux.actions.getCurrentLocation((err, location) => {
          if (!location) {
            return resolve();
          }
          flux.actions.loadSuggestions(location, undefined, resolve);
        });
      }));

    } else {
      promises.push(new Promise(resolve => flux.actions.loadSuggestions(user.location, undefined, resolve)));
    }

    Promise.all(promises).then(() => done(), err => done(err));
  });

};

const mapStoresProps = stores => {
  const categories = stores.categories.get();
  const chat = stores.chat.getState();
  const conversations = stores.conversations.getConversations(chat.conversationIds);
  const currencies  = stores.currencies.get();
  const currentLocation = stores.location.getCurrentLocation();
  const loggedUser = stores.auth.getLoggedProfile();
  const shuffledCategories = stores.categories.shuffle();
  const suggestedShout = stores.SuggestionsByLocationStore.getSuggestedShout(currentLocation);
  const suggestedShouts = stores.SuggestionsByLocationStore.getSuggestedShouts(currentLocation);
  const suggestedTags = stores.SuggestionsByLocationStore.getSuggestedTags(currentLocation);
  const suggestedUsers = stores.SuggestionsByLocationStore.getSuggestedUsers(currentLocation);
  const uiNotifications = stores.ui_notifications.getNotifications();
  const videoCallState = stores.videocall.getState();

  let listening;
  let loggedUserListeners;
  if (loggedUser) {
    listening = stores.ListeningStore.getListening(loggedUser.id);
    loggedUserListeners = stores.ListenersStore.getListeners(loggedUser.id);
  }

  return {
    categories,
    chat,
    conversations,
    currencies,
    currentLocation,
    loggedUserListeners,
    listening,
    loggedUser,
    shuffledCategories,
    suggestedShout,
    suggestedShouts,
    suggestedTags,
    suggestedUsers,
    uiNotifications,
    videoCallState
  };
};

export class Application extends React.Component {

  componentDidMount() {
    const { flux } = this.props;
    if (this.props.loggedUser) {
      flux.actions.initTwilio();
    }
  }

  componentDidUpdate(prevProps) {
    const { actions } = this.props.flux;
    const { loggedUser } = this.props;
    const hasBeenLoggedIn = !prevProps.loggedUser && loggedUser;

    if (hasBeenLoggedIn) {
      actions.initTwilio();
      actions.loadSuggestions(loggedUser.location || {});
      actions.loadConversations();
      actions.loadListeners(loggedUser);
      actions.loadListening(loggedUser, "users");
    }
  }

  render() {
    const { children, ...props } = this.props;
    //
    const hideHeader = this.props.routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );

    return (
      <div className={`App${hideHeader ? "" : " stickyHeader"}` }>
        { !hideHeader &&
          <div className="App-header">
            <Header
              history={ props.history }
              loggedUser={ props.loggedUser }
              currentLocation={ props.currentLocation }
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

Application = ConnectToStores(Application, { fetchData, mapStoresProps, listenToStores });

export default Application;
