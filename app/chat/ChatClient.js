import request from "superagent";

export function loadPreviousConversations(before) {
  return request.get("/api/conversations").query({ before });
}

export function loadNextConversations(after) {
  return request.get("/api/conversations").query({ after });
}
