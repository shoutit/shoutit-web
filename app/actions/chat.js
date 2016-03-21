
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

export function loadMessages(conversationId, options={}) {
  const params = {
    conversationId,
    previousUrl: null,
    nextUrl: null,
    ...options
  };
  return {
    types: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE
    ],
    page: options.previousUrl ? "previous" : options.nextUrl ? "next" : "first",
    payload: {
      conversationId // tell the pagination reducer we are loading this conversation
    },
    service: {
      name: "messages",
      params,
      schema: Schemas.MESSAGES
    }
  };
}
