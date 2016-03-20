
import * as actionTypes from "./actionTypes";

import { Schemas } from "../schemas";

export function loadConversations() {
  return {
    service: {
      name: "conversations",
      types: [
        actionTypes.LOAD_CONVERSATIONS_START,
        actionTypes.LOAD_CONVERSATIONS_SUCCESS,
        actionTypes.LOAD_CONVERSATIONS_FAILURE
      ],
      schema: Schemas.CONVERSATIONS
    }
  };
}

export function loadMessages(conversationId, { before, after }) {
  return {
    service: {
      name: "messages",
      params: { id: conversationId, before, after },
      types: [
        actionTypes.LOAD_MESSAGES_START,
        actionTypes.LOAD_MESSAGES_SUCCESS,
        actionTypes.LOAD_MESSAGES_FAILURE
      ],
      schema: Schemas.MESSAGES
    }
  };
}
