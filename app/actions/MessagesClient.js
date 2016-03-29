import request from 'superagent';

export function replyToConversation(conversationId, message) {
  return request.post(`/api/conversations/${conversationId}/reply`).send(message);
}

export function replyToShout(shoutId, message) {
  return request.post(`/api/shouts/${shoutId}/reply`).send(message);
}

export function sendMessage(username, message) {
  return request.post(`/api/users/${username}/message`).send(message);
}
