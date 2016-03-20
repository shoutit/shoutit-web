
import * as actionTypes from "./actionTypes";

export function loadConversations() {
  return {
    service: {
      name: "conversations",
      types: [
        actionTypes.LOAD_CONVERSATIONS_START,
        actionTypes.LOAD_CONVERSATIONS_SUCCESS,
        actionTypes.LOAD_CONVERSATIONS_FAILURE
      ]
    }
  };
}

export function loadListeners(user) {
  return {
    service: {
      name: "listeners",
      params: { user },
      types: [
        actionTypes.LOAD_LISTENERS_START,
        actionTypes.LOAD_LISTENERS_SUCCESS,
        actionTypes.LOAD_LISTENERS_FAILURE
      ]
    }
  };
}

export function loadListening(user) {
  return {
    service: {
      name: "listeners",
      params: { user },
      types: [
        actionTypes.LOAD_LISTENING_START,
        actionTypes.LOAD_LISTENING_SUCCESS,
        actionTypes.LOAD_LISTENING_FAILURE
      ]
    }
  };
}
