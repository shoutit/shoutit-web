import Pusher from "pusher-js";
let client;
const APP_KEY = "86d676926d4afda44089";

if (process.env.NODE_ENV === "development") {
  Pusher.log = function(message) {
    console.log(message); // eslint-disable-line no-console
  };
}

export function get() {
  return client;
}

export function setup(usersStore, {
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

  const loggedUser = usersStore.getLoggedUser();

  if (loggedUser) {
    subscribe(loggedUser);
  }

  usersStore.on("login", () => subscribe(usersStore.getLoggedUser()));
  usersStore.on("logout", () => unsubscribe() );
}
