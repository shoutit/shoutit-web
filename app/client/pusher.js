import Pusher from "pusher-js";
import debug from "debug";

const APP_KEY = "86d676926d4afda44089";

Pusher.log = message => debug("shoutit:pusher")(message);

export let client;

export function subscribe(channelName, data, callback) {
  const channel = client.subscribe(channelName, data);
  channel.bind("pusher:subscription_error", status => callback(status, channel));
  channel.bind("pusher:subscription_succeeded", () => callback(null, channel));
  return channel;
}

export function unsubscribe(channel) {
  client.unsubscribe(channel.name);
}

export function setupPusher(authStore, {
  onNewMessage,
  onNewListener,
  onProfileChange
} ) {

  if (client) {
    return;
  }

  client = new Pusher(APP_KEY, {
    encrypted: true,
    authEndpoint: "/api/pusher/auth"
  });

  const subscribe = user => {
    const channelId = `presence-u-${user.id}`;
    const presenceChannel = client.subscribe(channelId);
    client.presenceChannel = presenceChannel;

    presenceChannel.bind("pusher:subscription_succeeded", () => {
      presenceChannel.bind("new_message", onNewMessage);
      presenceChannel.bind("new_listen", onNewListener);
      presenceChannel.bind("profile_change", onProfileChange);
    });

  };

  const unsubscribe = () => {
    if (client.presenceChannel) {
      client.unsubscribe(client.presenceChannel.name);
      client.presenceChannel = null;
    }
  };

  const loggedProfile = authStore.getLoggedProfile();

  if (loggedProfile) {
    subscribe(loggedProfile);
  }

  authStore.on("login", () => subscribe(authStore.getLoggedProfile()));
  authStore.on("logout", () => unsubscribe() );
}
