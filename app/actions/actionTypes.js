
// Auth

export const GET_SESSION_START = "GET_SESSION_START";
export const GET_SESSION_SUCCESS = "GET_SESSION_SUCCESS";
export const GET_SESSION_FAILURE = "GET_SESSION_FAILURE";

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const SIGNUP_START = "SIGNUP_START";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

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
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

// Chat

export const LOAD_CONVERSATIONS_START = "LOAD_CONVERSATIONS_START";
export const LOAD_CONVERSATIONS_SUCCESS = "LOAD_CONVERSATIONS_SUCCESS";
export const LOAD_CONVERSATIONS_FAILURE = "LOAD_CONVERSATIONS_FAILURE";

export const LOAD_CONVERSATION_START = "LOAD_CONVERSATION_START";
export const LOAD_CONVERSATION_SUCCESS = "LOAD_CONVERSATION_SUCCESS";
export const LOAD_CONVERSATION_FAILURE = "LOAD_CONVERSATION_FAILURE";

export const LOAD_MESSAGES_START = "LOAD_MESSAGES_START";
export const LOAD_MESSAGES_SUCCESS = "LOAD_MESSAGES_SUCCESS";
export const LOAD_MESSAGES_FAILURE = "LOAD_MESSAGES_FAILURE";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const SET_CURRENT_CONVERSATION = "SET_CURRENT_CONVERSATION";

export const CONVERSATION_DRAFT_CHANGE = "CONVERSATION_DRAFT_CHANGE";

export const LEAVE_CONVERSATION_START = "LEAVE_CONVERSATION_START";
export const LEAVE_CONVERSATION_SUCCESS = "LEAVE_CONVERSATION_SUCCESS";
export const LEAVE_CONVERSATION_FAILURE = "LEAVE_CONVERSATION_FAILURE";

export const RESET_LAST_LOADED_CONVERSATION = "RESET_LAST_LOADED_CONVERSATION";
export const MARK_AS_READ = "MARK_AS_READ";
export const MARK_AS_READ_SUCCESS = "MARK_AS_READ_SUCCESS";
export const MARK_AS_READ_FAILURE = "MARK_AS_READ_FAILURE";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";

export const REPLY_CONVERSATION_START = "REPLY_CONVERSATION_START";
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

// Location

export const GET_CURRENT_LOCATION_START = "GET_CURRENT_LOCATION_START";
export const GET_CURRENT_LOCATION_FAILURE = "GET_CURRENT_LOCATION_FAILURE";
export const GET_CURRENT_LOCATION_SUCCESS = "GET_CURRENT_LOCATION_SUCCESS";

// Categories

export const LOAD_CATEGORIES_START = "LOAD_CATEGORIES_START";
export const LOAD_CATEGORIES_FAILURE = "LOAD_CATEGORIES_FAILURE";
export const LOAD_CATEGORIES_SUCCESS = "LOAD_CATEGORIES_SUCCESS";

// Currencies

export const LOAD_CURRENCIES_START = "LOAD_CURRENCIES_START";
export const LOAD_CURRENCIES_FAILURE = "LOAD_CURRENCIES_FAILURE";
export const LOAD_CURRENCIES_SUCCESS = "LOAD_CURRENCIES_SUCCESS";

// Suggestions

export const LOAD_SUGGESTIONS_START = "LOAD_SUGGESTIONS_START";
export const LOAD_SUGGESTIONS_FAILURE = "LOAD_SUGGESTIONS_FAILURE";
export const LOAD_SUGGESTIONS_SUCCESS = "LOAD_SUGGESTIONS_SUCCESS";

// Listeners

export const LOAD_LISTENERS_START = "LOAD_LISTENERS_START";
export const LOAD_LISTENERS_FAILURE = "LOAD_LISTENERS_FAILURE";
export const LOAD_LISTENERS_SUCCESS = "LOAD_LISTENERS_SUCCESS";

// Listening

export const LOAD_LISTENING_START = "LOAD_LISTENING_START";
export const LOAD_LISTENING_FAILURE = "LOAD_LISTENING_FAILURE";
export const LOAD_LISTENING_SUCCESS = "LOAD_LISTENING_SUCCESS";

// PUSHER

export const PUSHER_NEW_MESSAGE = "PUSHER_NEW_MESSAGE";
export const PUSHER_NEW_LISTEN = "PUSHER_NEW_LISTEN";
export const PUSHER_PROFILE_CHANGE = "PUSHER_PROFILE_CHANGE";

// Forms
export const FORM_SAVE_DRAFT = "FORM_SAVE_DRAFT";
