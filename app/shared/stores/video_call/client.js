import request from "superagent";

export function getTwilioToken() {
  return request.get("/api/twilio/video_auth");
}
