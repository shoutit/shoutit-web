import request from "superagent";

export function loadMessages(id) {
  return request.get(`/api/conversations/${id}/messages`);
}

export function loadPreviousMessages(id, before) {
  return request.get(`/api/conversations/${id}/messages`).query({ before });
}

export function loadNextMessages(id, after) {
  return request.get(`/api/conversations/${id}/messages`).query({ after });
}

export function markAsRead(id) {
  return request.post(`/api/conversations/${id}/read`);
}

export function deleteConversation(id) {
  return request.del(`/api/conversations/${id}`);
}
