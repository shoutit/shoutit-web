import auth from "./auth";

export default function() {
  return {
    auth: auth(this, "pusher")
  };
}
