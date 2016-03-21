import actionTypes from "../actions/actionTypes";

export function newMessage(payload) {
  return {
    type: actionTypes.PUSHER_NEW_MESSAGE,
    payload
  };
}

export function newListen(payload) {
  return {
    type: actionTypes.PUSHER_NEW_LISTEN,
    payload
  };
}

export function profileChange(payload) {
  return {
    type: actionTypes.PUSHER_PROFILE_CHANGE,
    payload
  };
}
