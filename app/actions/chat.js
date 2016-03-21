
import * as actionTypes from "./actionTypes";

import { Schemas } from "../schemas";

export function loadConversations() {
  return {
    types: [
      actionTypes.LOAD_CONVERSATIONS_START,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS,
      actionTypes.LOAD_CONVERSATIONS_FAILURE
    ],
    service: {
      name: "conversations",
      schema: Schemas.CONVERSATIONS
    }
  };
}

export function loadMessages(conversationId, options) {
  options = {
    before: null,
    after: null,
    ...options
  };
  return {
    types: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE
    ],
    payload: {
      conversationId
    },
    service: {
      name: "messages",
      params: {
        conversationId,
        ...options
      },
      schema: Schemas.MESSAGES
    }
  };
}
