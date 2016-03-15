import rest from "restler";

import shouts from "./shouts";
import discover from "./discover";
import users from "./users";
import tags from "./tags";
import misc from "./misc";
import pusher from "./pusher";
import conversations from "./conversations";
import auth from "./auth";

import { apiUrl } from "../../config";

const ShoutitClient = rest.service(function (endpoint) {
  this.defaults.headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
  this.baseURL = endpoint;
}, {}, {
  shouts, discover, users, tags, misc, pusher, conversations, auth
});

export default new ShoutitClient(apiUrl);
