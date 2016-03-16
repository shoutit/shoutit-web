import Fluxxor from "fluxxor";
import debug from "debug";

// import stores
import AuthStore from "./stores/AuthStore";
import ChatStore from "./stores/ChatStore";
import UINotificationsStore from "./stores/UINotificationsStore";
import ConversationsStore from "./stores/ConversationsStore";
import MessagesStore from "./stores/MessagesStore";
import VideoCallsStore from "./stores/VideoCallsStore";
import SuggestionsStore from "./shared/stores/suggestions/SuggestionsStore";
import UsersStore from "./shared/stores/users/store";
import ShoutStore from "./shared/stores/shouts/store";
import TagStore from "./shared/stores/tags/store";
import SearchStore from "./shared/stores/search/store";
import LocationsStore from "./shared/stores/locations/store";
import NotificationsStore from "./shared/stores/notifications/store";
import DiscoversStore from "./shared/stores/discovers/store";

// import actions
import AuthActions from "./actions/AuthActions";
import ChatActions from "./actions/ChatActions";
import ConversationsActions from "./actions/ConversationsActions";
import MessagesActions from "./actions/MessagesActions";
import VideoCallsActions from "./actions/VideoCallsActions";
import UserActions from "./shared/stores/users/actions";
import ShoutActions from "./shared/stores/shouts/actions";
import TagActions from "./shared/stores/tags/actions";
import SearchActions from "./shared/stores/search/actions";
import LocationsActions from "./shared/stores/locations/actions";
import NotificationsActions from "./shared/stores/notifications/actions";
import DiscoversActions from "./shared/stores/discovers/actions";
import SuggestionsActions from "./shared/stores/suggestions/actions";
import UINotificationsActions from "./actions/UINotificationsActions";

export default function Flux(fetchr) {

  const stores = {
    auth: new AuthStore(),
    chat: new ChatStore(),
    conversations: new ConversationsStore(),
    discovers: new DiscoversStore(),
    locations: new LocationsStore(),
    messages: new MessagesStore(),
    notifications: new NotificationsStore(),
    search: new SearchStore(),
    shouts: new ShoutStore(),
    suggestions: new SuggestionsStore(),
    tags: new TagStore(),
    ui_notifications: new UINotificationsStore(),
    users: new UsersStore(),
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
