/**
 * Created by Philip on 22.06.2015.
 */

import request from "superagent";

export function loadConversations() {
  return request.get("/api/conversations")
}

export function loadMoreConversations(query) {
  return loadConversations().query(query)
}

export function loadMessages(id) {
  return request.get(`/api/conversations/${id}/messages`)
}

export function loadMoreMessages(id, query) {
  return loadMessages(id).query(query)
}

export function deleteMessage(id) {
  return request.del(`/api/messages/${id}`)
}

export function readConversation(id) {
  return request.post(`/api/conversations/${id}/read`)
}

export function unreadConversation(id) {
  return request.del(`/api/conversations/${id}/read`)
}

export function replyConversation(id, message) {
  return request.post(`/api/conversations/${id}/reply`).send(message)
}
