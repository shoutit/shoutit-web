/* eslint-env node */

import { actions as chatActions } from "./stores/chat/actions";
import { actions as conversationsActions } from "./stores/conversations/actions";
import { actions as messagesActions } from "./stores/messages/actions";

import { ChatStore } from "./stores/chat/ChatStore";
import { ConversationsStore } from "./stores/conversations/ConversationsStore";
import { MessagesStore } from "./stores/messages/MessagesStore";

var merge = require("lodash/object/merge"),
  Fluxxor = require("fluxxor"),
  UsersStore = require("./stores/users/store"),
  ShoutStore = require("./stores/shouts/store"),
  TagStore = require("./stores/tags/store"),
  SearchStore = require("./stores/search/store"),
  LocationsStore = require("./stores/locations/store"),
  NotificationsStore = require("./stores/notifications/store"),
  DiscoversStore = require("./stores/discovers/store"),
  userActions = require("./stores/users/actions"),
  shoutActions = require("./stores/shouts/actions"),
  tagActions = require("./stores/tags/actions"),
  searchActions = require("./stores/search/actions"),
  locationsActions = require("./stores/locations/actions"),
  notificationsActions = require("./stores/notifications/actions"),
  discoversActions = require("./stores/discovers/actions");

module.exports = function (router, user, data, params, currencies, categories, sortTypes) {
  var stores = {
    users: new UsersStore(merge({}, {
        loggedUser: user,
        router: router
      }, data)),
    shouts: new ShoutStore(merge({}, data, {currencies, categories, sortTypes}), params),
    tags: new TagStore(data, params),
    search: new SearchStore(merge({}, data, {categories}, params)),
    locations: new LocationsStore(merge({}, data, {router, params})),
    conversations: new ConversationsStore(merge({}, data, {loggedUser: user, params})),
    chat: new ChatStore(merge({}, data, {loggedUser: user, params})),
    messages: new MessagesStore(merge({}, data, {loggedUser: user, params})),
    notifications: new NotificationsStore({data}),
    discovers: new DiscoversStore(data)
  };

  var actions = merge({},
    userActions, shoutActions, tagActions, searchActions, locationsActions,
    messagesActions, chatActions, conversationsActions, notificationsActions, discoversActions);

  var flux = new Fluxxor.Flux(stores, actions);

  flux.serialize = function () {
    var storeData = {};

    for (var store in stores) {
      if (stores.hasOwnProperty(store)) {
        storeData[store] = stores[store].serialize();
      }
    }

    return JSON.stringify(storeData);
  };

  flux.hydrate = function (storeData) {
    for (var store in storeData) {
      if (storeData.hasOwnProperty(store)) {
        stores[store].hydrate(storeData[store]);
      }
    }
  };

  return flux;
};
