
// Auth

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const SIGNUP_START = "SIGNUP_START";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const RESET_AUTH_ERRORS = "RESET_AUTH_ERRORS";

export const EMAIL_VERIFICATION_START = "EMAIL_VERIFICATION_START";
export const EMAIL_VERIFICATION_SUCCESS = "EMAIL_VERIFICATION_SUCCESS";
export const EMAIL_VERIFICATION_FAILURE = "EMAIL_VERIFICATION_FAILURE";

export const SEND_EMAIL_VERIFICATION_START = "SEND_EMAIL_VERIFICATION_START";
export const SEND_EMAIL_VERIFICATION_FAILURE = "SEND_EMAIL_VERIFICATION_FAILURE";
export const SEND_EMAIL_VERIFICATION_SUCCESS = "SEND_EMAIL_VERIFICATION_SUCCESS";

export const PASSWORD_RESET_START = "PASSWORD_RESET_START";
export const PASSWORD_RESET_FAILURE = "PASSWORD_RESET_FAILURE";
export const PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS";

export const LOGOUT = "LOGOUT";

// Chat

export const LOAD_CONVERSATIONS = "LOAD_CONVERSATIONS";
export const LOAD_CONVERSATIONS_SUCCESS = "LOAD_CONVERSATIONS_SUCCESS";
export const LOAD_CONVERSATIONS_FAILURE = "LOAD_CONVERSATIONS_FAILURE";

export const LOAD_MESSAGES = "LOAD_MESSAGES";
export const LOAD_NEXT_MESSAGES = "LOAD_NEXT_MESSAGES";
export const LOAD_PREVIOUS_MESSAGES = "LOAD_PREVIOUS_MESSAGES";
export const LOAD_MESSAGES_SUCCESS = "LOAD_MESSAGES_SUCCESS";
export const LOAD_MESSAGES_FAILURE = "LOAD_MESSAGES_FAILURE";
export const CONVERSATION_DRAFT_CHANGE = "CONVERSATION_DRAFT_CHANGE";
export const DELETE_CONVERSATION = "DELETE_CONVERSATION";
export const DELETE_CONVERSATION_SUCCESS = "DELETE_CONVERSATION_SUCCESS";
export const DELETE_CONVERSATION_FAILURE = "DELETE_CONVERSATION_FAILURE";
export const RESET_LAST_LOADED_CONVERSATION = "RESET_LAST_LOADED_CONVERSATION";
export const MARK_AS_READ = "MARK_AS_READ";
export const MARK_AS_READ_SUCCESS = "MARK_AS_READ_SUCCESS";
export const MARK_AS_READ_FAILURE = "MARK_AS_READ_FAILURE";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";

export const REPLY_CONVERSATION = "REPLY_CONVERSATION";
export const REPLY_CONVERSATION_FAILURE = "REPLY_CONVERSATION_FAILURE";
export const REPLY_CONVERSATION_SUCCESS = "REPLY_CONVERSATION_SUCCESS";

export const REPLY_SHOUT = "REPLY_SHOUT";
export const REPLY_SHOUT_FAILURE = "REPLY_SHOUT_FAILURE";
export const REPLY_SHOUT_SUCCESS = "REPLY_SHOUT_SUCCESS";

export const NEW_PUSHED_MESSAGE = "NEW_PUSHED_MESSAGE";

// Video calls

export const TWILIO_INIT = "TWILIO_INIT";
export const TWILIO_INIT_SUCCESS = "TWILIO_INIT_SUCCESS";
export const TWILIO_INIT_FAILURE = "TWILIO_INIT_FAILURE";

export const VIDEOCALL_OUTGOING = "VIDEOCALL_OUTGOING";
export const VIDEOCALL_OUTGOING_ACCEPTED = "VIDEOCALL_OUTGOING_ACCEPTED";
export const VIDEOCALL_OUTGOING_REJECTED = "VIDEOCALL_OUTGOING_REJECTED";
export const VIDEOCALL_OUTGOING_CANCELED = "VIDEOCALL_OUTGOING_CANCELED";
export const VIDEOCALL_OUTGOING_FAILURE = "VIDEOCALL_OUTGOING_FAILURE";

export const VIDEOCALL_PREVIEW = "VIDEOCALL_PREVIEW";

export const VIDEOCALL_INCOMING = "VIDEOCALL_INCOMING";
export const VIDEOCALL_INCOMING_ACCEPTED = "VIDEOCALL_INCOMING_ACCEPTED";
export const VIDEOCALL_INCOMING_REJECTED = "VIDEOCALL_INCOMING_REJECTED";
export const VIDEOCALL_INCOMING_CANCELED = "VIDEOCALL_INCOMING_CANCELED";
export const VIDEOCALL_INCOMING_FAILURE = "VIDEOCALL_INCOMING_FAILURE";

export const VIDEOCALL_DISCONNECTED = "VIDEOCALL_DISCONNECTED";
export const VIDEOCALL_PARTICIPANT_DISCONNECTED = "VIDEOCALL_PARTICIPANT_DISCONNECTED";

// Notifications

export const DISMISS_UI_NOTIFICATION = "DISMISS_UI_NOTIFICATION";
export const NOTIFY = "NOTIFY";
