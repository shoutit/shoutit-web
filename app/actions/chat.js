
import * as actionTypes from "./actionTypes";
import uuid from "uuid";

import { getUnixTime } from "../utils/DateUtils";

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

export function loadMessages(conversationId, endpoint) {
  return {
    types: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE
    ],
    payload: { conversationId },
    service: {
      name: "messages",
      params: {
        conversationId, endpoint
      },
      schema: Schemas.MESSAGES
    }
  };
}

export function addMessage(payload) {  // normalized payload
  return {
    type: actionTypes.ADD_NEW_MESSAGE,
    payload
  };
}

export function replyToConversation(conversationId, sender, message) {
  message = {
    ...message,
    user: sender,
    id: "temp-" + uuid.v1(),
    createdAt: getUnixTime()
  };
  return {
    types: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE
    ],
    payload: {
      conversationId, message
    },
    service: {
      name: "conversationReply",
      method: "create",
      params: { conversationId },
      body: message,
      schema: Schemas.MESSAGE
    }
  };
}

export function deleteConversation(id) {
  return {
    types: [
      actionTypes.DELETE_CONVERSATION_START,
      actionTypes.DELETE_CONVERSATION_SUCCESS,
      actionTypes.DELETE_CONVERSATION_FAILURE
    ],
    payload: { id },
    service: {
      name: "conversations",
      method: "delete",
      params: {
        id
      }
    }
  };
}
