import Fluxxor from "fluxxor";
import debug from "debug";

// import stores
import AuthStore from "../stores/AuthStore";
import ChatStore from "../stores/ChatStore";
import ConversationsStore from "../stores/ConversationsStore";
import MessagesStore from "../stores/MessagesStore";
import VideoCallsStore from "../stores/VideoCallsStore";
import SuggestionsStore from "./stores/suggestions/SuggestionsStore";
import { UINotificationsStore } from "./stores/ui_notifications/UINotificationsStore";
import UsersStore from "./stores/users/store";
import ShoutStore from "./stores/shouts/store";
import TagStore from "./stores/tags/store";
import SearchStore from "./stores/search/store";
import LocationsStore from "./stores/locations/store";
import NotificationsStore from "./stores/notifications/store";
import DiscoversStore from "./stores/discovers/store";

// import actions
import AuthActions from "../actions/AuthActions";
import ChatActions from "../actions/ChatActions";
import ConversationsActions from "../actions/ConversationsActions";
import MessagesActions from "../actions/MessagesActions";
import VideoCallsActions from "../actions/VideoCallsActions";
import UserActions from "./stores/users/actions";
import ShoutActions from "./stores/shouts/actions";
import TagActions from "./stores/tags/actions";
import SearchActions from "./stores/search/actions";
import LocationsActions from "./stores/locations/actions";
import NotificationsActions from "./stores/notifications/actions";
import DiscoversActions from "./stores/discovers/actions";
import SuggestionsActions from "./stores/suggestions/actions";
import UINotificationsActions from "./stores/ui_notifications/actions";

export default function Flux(initialState={}, fetchr) {

  const stores = {
    auth: new AuthStore(initialState.auth),
    chat: new ChatStore(),
    conversations: new ConversationsStore(),
    discovers: new DiscoversStore(initialState.discovers),
    locations: new LocationsStore(initialState.locations),
    messages: new MessagesStore(),
    notifications: new NotificationsStore(initialState.notifications),
    search: new SearchStore(initialState.search),
    shouts: new ShoutStore(initialState.shouts),
    suggestions: new SuggestionsStore(initialState.suggestions),
    tags: new TagStore(initialState.tags),
    ui_notifications: new UINotificationsStore(),
    users: new UsersStore(initialState.users),
    videocall: new VideoCallsStore()
  };

  for (const store in stores) {
    stores[store].on("change", () =>
      debug(`shoutit:flux:${store}`)("Emitted change", stores[store].getState())
    );
  }

  const actions = {
    ...AuthActions,
    ...ChatActions,
    ...ConversationsActions,
    ...DiscoversActions,
    ...LocationsActions,
    ...MessagesActions,
    ...NotificationsActions,
    ...SearchActions,
    ...ShoutActions,
    ...SuggestionsActions,
    ...TagActions,
    ...UINotificationsActions,
    ...UserActions,
    ...VideoCallsActions
  };

  const flux = new Fluxxor.Flux(stores, actions);

  flux.service = fetchr;
  flux.dehydrate = () => {
    const storesState = {};
    Object.keys(stores).forEach(storeName => {
      if (!stores[storeName].serialize) {
        return debug("shoutit:flux")("Store %s has no serialize method", storeName);
      }
      storesState[storeName] = stores[storeName].serialize();
      debug("shoutit:flux")("Store %s has been dehydrated", storeName);
    });
    return JSON.stringify(storesState);
  };

  flux.rehydrate = storesState => {
    Object.keys(storesState).forEach(storeName => {
      if (!stores[storeName].hydrate) {
        return debug("shoutit:flux")("Store %s has no hydrate method", storeName);
      }
      stores[storeName].hydrate(storesState[storeName]);
      debug("shoutit:flux")("Rehydrated %s store", storeName, stores[storeName].getState());
    });
  };

  return flux;
}
