/* eslint no-console: 0 */
import Pusher from "pusher-js";

const APP_KEY = "86d676926d4afda44089";
const AUTH_ENDPOINT = "/api/pusher/auth";

if (process.env.NODE_ENV === "development") {
  Pusher.log = function(message) {
    console.log(message);
  };
}

let isPusherClientInitialized = false;

export default function setupPusherClient(usersStore, { onNewMessage, onNewListen, onProfileChange } ) {

  if (isPusherClientInitialized) {
    console.warn("Pusher client already initialized."); // eslint-ignore-line
    return;
  }

  const pusherClient = new Pusher(APP_KEY, {
    encrypted: true,
    authEndpoint: AUTH_ENDPOINT
  });

  const subscribeUser = user => {
    const channelId = `presence-u-${user.id}`;
    const presenceChannel = pusherClient.subscribe(channelId);
    pusherClient.presenceChannel = presenceChannel;

    presenceChannel.bind("pusher:subscription_succeeded", () => {
      console.log("Pusher subscribed to channel", channelId);

      presenceChannel.bind("new_message", onNewMessage);
      presenceChannel.bind("new_listen", onNewListen);
      presenceChannel.bind("profile_change", onProfileChange);
    });

  };

  const unsubscribeUser = () => {
    if (pusherClient.presenceChannel) {
      pusherClient.unsubscribe(pusherClient.presenceChannel.name);
      pusherClient.presenceChannel = null;
    }
  };

  const loggedUser = usersStore.getLoggedUser();

  if (loggedUser) {
    subscribeUser(loggedUser);
  }

  usersStore.on("login", () => subscribeUser(usersStore.getLoggedUser()));
  usersStore.on("logout", () => unsubscribeUser() );

  isPusherClientInitialized = true;

  return pusherClient;

}
