import Fluxxor from "fluxxor";
import debug from "debug";

// import stores

import * as stores from "./stores";

import UINotificationsStore from "./stores/UINotificationsStore";
import VideoCallsStore from "./stores/VideoCallsStore";

import UsersStore from "./shared/stores/users/store";
import ShoutStore from "./shared/stores/shouts/store";
import TagStore from "./shared/stores/tags/store";
import SearchStore from "./shared/stores/search/store";
import LocationsStore from "./shared/stores/locations/store";
import NotificationsStore from "./shared/stores/notifications/store";
import DiscoversStore from "./shared/stores/discovers/store";

// import actions

import * as actions from "./actions";
import DiscoversActions from "./shared/stores/discovers/actions";
import LocationsActions from "./shared/stores/locations/actions";
import NotificationsActions from "./shared/stores/notifications/actions";
import SearchActions from "./shared/stores/search/actions";
import ShoutActions from "./shared/stores/shouts/actions";
import SuggestionsActions from "./shared/stores/suggestions/actions";
import TagActions from "./shared/stores/tags/actions";
import UINotificationsActions from "./actions/UINotificationsActions";
import UserActions from "./shared/stores/users/actions";

const fluxStores = Object.keys(stores).reduce(
  (result, key) => ({
    ...result,
    [key]: new stores[key]()
  }),
  {}
);
let fluxActions = Object.keys(actions).reduce(
  (result, key) => ({ ...result, ...actions[key] }),
  {}
);

const log = debug("shoutit:flux");

export default function Flux(fetchr) {

  const stores = {
    ...fluxStores,
    discovers: new DiscoversStore(),
    locations: new LocationsStore(),
    notifications: new NotificationsStore(),
    search: new SearchStore(),
    shouts: new ShoutStore(),
    tags: new TagStore(),
    ui_notifications: new UINotificationsStore(),
    users: new UsersStore(),
    videocall: new VideoCallsStore()
  };

  for (const store in stores) {
    log("Registered store %s", store);
    stores[store].on("change", () =>
      debug(`shoutit:flux:${store}`)("Emitted change")
    );
  }

  fluxActions = {
    ...fluxActions,
    ...DiscoversActions,
    ...LocationsActions,
    ...NotificationsActions,
    ...SearchActions,
    ...ShoutActions,
    ...SuggestionsActions,
    ...TagActions,
    ...UINotificationsActions,
    ...UserActions
  };

  const flux = new Fluxxor.Flux(stores, fluxActions);

  flux.service = fetchr;
  flux.dehydrate = () => {
    const storesState = {};
    Object.keys(stores).forEach(storeName => {
      if (!stores[storeName].serialize) {
        return log("Store %s has no serialize method", storeName);
      }
      storesState[storeName] = stores[storeName].serialize();
      log("Store %s has been dehydrated", storeName);
    });
    return JSON.stringify(storesState);
  };

  flux.rehydrate = storesState => {
    Object.keys(storesState).forEach(storeName => {
      if (!stores[storeName].hydrate) {
        return log("Store %s has no hydrate method", storeName);
      }
      stores[storeName].hydrate(storesState[storeName]);
      log("Rehydrated %s store", storeName, stores[storeName].getState());
    });
  };

  flux.on("dispatch", (type, payload) =>
    log("Dispatching %s", type)
  );

  return flux;
}
