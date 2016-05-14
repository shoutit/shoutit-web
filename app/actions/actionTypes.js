
// Auth

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const SIGNUP_START = 'SIGNUP_START';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

export const VERIFY_EMAIL_START = 'VERIFY_EMAIL_START';
export const VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS';
export const VERIFY_EMAIL_FAILURE = 'VERIFY_EMAIL_FAILURE';

export const SEND_EMAIL_VERIFICATION_START = 'SEND_EMAIL_VERIFICATION_START';
export const SEND_EMAIL_VERIFICATION_FAILURE = 'SEND_EMAIL_VERIFICATION_FAILURE';
export const SEND_EMAIL_VERIFICATION_SUCCESS = 'SEND_EMAIL_VERIFICATION_SUCCESS';

export const PASSWORD_RESET_START = 'PASSWORD_RESET_START';
export const PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';

export const PASSWORD_SET_START = 'PASSWORD_SET_START';
export const PASSWORD_SET_FAILURE = 'PASSWORD_SET_FAILURE';
export const PASSWORD_SET_SUCCESS = 'PASSWORD_SET_SUCCESS';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const RESET_SESSION_ERRORS = 'RESET_SESSION_ERRORS';

export const UPDATE_PASSWORD_START = 'UPDATE_PASSWORD_START';
export const UPDATE_PASSWORD_FAILURE = 'UPDATE_PASSWORD_FAILURE';
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';


// Chat

export const LOAD_CHAT_START = 'LOAD_CHAT_START';
export const LOAD_CHAT_SUCCESS = 'LOAD_CHAT_SUCCESS';
export const LOAD_CHAT_FAILURE = 'LOAD_CHAT_FAILURE';

export const LOAD_CONVERSATION_START = 'LOAD_CONVERSATION_START';
export const LOAD_CONVERSATION_SUCCESS = 'LOAD_CONVERSATION_SUCCESS';
export const LOAD_CONVERSATION_FAILURE = 'LOAD_CONVERSATION_FAILURE';

export const LOAD_MESSAGES_START = 'LOAD_MESSAGES_START';
export const LOAD_MESSAGES_SUCCESS = 'LOAD_MESSAGES_SUCCESS';
export const LOAD_MESSAGES_FAILURE = 'LOAD_MESSAGES_FAILURE';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SET_ACTIVE_CONVERSATION = 'SET_ACTIVE_CONVERSATION';
export const UNSET_ACTIVE_CONVERSATION = 'UNSET_ACTIVE_CONVERSATION';

export const LEAVE_CONVERSATION_START = 'LEAVE_CONVERSATION_START';
export const LEAVE_CONVERSATION_SUCCESS = 'LEAVE_CONVERSATION_SUCCESS';
export const LEAVE_CONVERSATION_FAILURE = 'LEAVE_CONVERSATION_FAILURE';

export const OPEN_CONVERSATION = 'OPEN_CONVERSATION';
export const START_CONVERSATION = 'START_CONVERSATION';
export const CLOSE_CONVERSATION = 'CLOSE_CONVERSATION';

export const CREATE_CONVERSATION_START = 'CREATE_CONVERSATION_START';
export const CREATE_CONVERSATION_SUCCESS = 'CREATE_CONVERSATION_SUCCESS';
export const CREATE_CONVERSATION_FAILURE = 'CREATE_CONVERSATION_FAILURE';

export const READ_CONVERSATION_START = 'READ_CONVERSATION_START';
export const READ_CONVERSATION_SUCCESS = 'READ_CONVERSATION_SUCCESS';
export const READ_CONVERSATION_FAILURE = 'READ_CONVERSATION_FAILURE';

export const UNREAD_CONVERSATION_START = 'UNREAD_CONVERSATION_START';
export const UNREAD_CONVERSATION_SUCCESS = 'UNREAD_CONVERSATION_SUCCESS';
export const UNREAD_CONVERSATION_FAILURE = 'UNREAD_CONVERSATION_FAILURE';

// Chat notifications

export const RECEIVE_CLIENT_IS_TYPING = 'RECEIVE_CLIENT_IS_TYPING';
export const NOTIFY_CLIENT_IS_TYPING = 'NOTIFY_CLIENT_IS_TYPING';
export const REMOVE_CLIENT_IS_TYPING = 'REMOVE_CLIENT_IS_TYPING';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';

export const REPLY_CONVERSATION_START = 'REPLY_CONVERSATION_START';
export const REPLY_CONVERSATION_FAILURE = 'REPLY_CONVERSATION_FAILURE';
export const REPLY_CONVERSATION_SUCCESS = 'REPLY_CONVERSATION_SUCCESS';

export const REPLY_SHOUT = 'REPLY_SHOUT';
export const REPLY_SHOUT_FAILURE = 'REPLY_SHOUT_FAILURE';
export const REPLY_SHOUT_SUCCESS = 'REPLY_SHOUT_SUCCESS';

export const NEW_PUSHED_MESSAGE = 'NEW_PUSHED_MESSAGE';

// Video calls

export const TWILIO_TOKEN_START = 'TWILIO_TOKEN_START';
export const TWILIO_TOKEN_SUCCESS = 'TWILIO_TOKEN_SUCCESS';
export const TWILIO_TOKEN_FAILURE = 'TWILIO_TOKEN_FAILURE';

export const START_VIDEOCALL = 'START_VIDEOCALL';
export const VIDEOCALL_ADD_INCOMING_INVITE = 'VIDEOCALL_ADD_INCOMING_INVITE';
export const VIDEOCALL_SET_OUTGOING_INVITE = 'VIDEOCALL_SET_OUTGOING_INVITE';

// UI

export const DISMISS_UI_NOTIFICATION = 'DISMISS_UI_NOTIFICATION';
export const NOTIFY = 'NOTIFY';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const OPEN_MODAL = 'OPEN_MODAL';

// Discover

export const LOAD_DISCOVER_ITEM_START = 'LOAD_DISCOVER_ITEM_START';
export const LOAD_DISCOVER_ITEM_SUCCESS = 'LOAD_DISCOVER_ITEM_SUCCESS';
export const LOAD_DISCOVER_ITEM_FAILURE = 'LOAD_DISCOVER_ITEM_FAILURE';

export const LOAD_DISCOVER_ITEMS_START = 'LOAD_DISCOVER_ITEMS_START';
export const LOAD_DISCOVER_ITEMS_SUCCESS = 'LOAD_DISCOVER_ITEMS_SUCCESS';
export const LOAD_DISCOVER_ITEMS_FAILURE = 'LOAD_DISCOVER_ITEMS_FAILURE';

export const LOAD_DISCOVER_SHOUTS_START = 'LOAD_DISCOVER_SHOUTS_START';
export const LOAD_DISCOVER_SHOUTS_SUCCESS = 'LOAD_DISCOVER_SHOUTS_SUCCESS';
export const LOAD_DISCOVER_SHOUTS_FAILURE = 'LOAD_DISCOVER_SHOUTS_FAILURE';

// Geolocation

export const UPDATE_CURRENT_LOCATION_START = 'UPDATE_CURRENT_LOCATION_START';
export const UPDATE_CURRENT_LOCATION_SUCCESS = 'UPDATE_CURRENT_LOCATION_SUCCESS';
export const UPDATE_CURRENT_LOCATION_FAILURE = 'UPDATE_CURRENT_LOCATION_FAILURE';

// Categories

export const LOAD_CATEGORIES_START = 'LOAD_CATEGORIES_START';
export const LOAD_CATEGORIES_FAILURE = 'LOAD_CATEGORIES_FAILURE';
export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS';

// Currencies

export const LOAD_CURRENCIES_START = 'LOAD_CURRENCIES_START';
export const LOAD_CURRENCIES_FAILURE = 'LOAD_CURRENCIES_FAILURE';
export const LOAD_CURRENCIES_SUCCESS = 'LOAD_CURRENCIES_SUCCESS';

// Suggestions

export const LOAD_SUGGESTIONS_START = 'LOAD_SUGGESTIONS_START';
export const LOAD_SUGGESTIONS_FAILURE = 'LOAD_SUGGESTIONS_FAILURE';
export const LOAD_SUGGESTIONS_SUCCESS = 'LOAD_SUGGESTIONS_SUCCESS';

// Listeners

export const LOAD_LISTENERS_START = 'LOAD_LISTENERS_START';
export const LOAD_LISTENERS_FAILURE = 'LOAD_LISTENERS_FAILURE';
export const LOAD_LISTENERS_SUCCESS = 'LOAD_LISTENERS_SUCCESS';

// Listening

export const LOAD_LISTENING_START = 'LOAD_LISTENING_START';
export const LOAD_LISTENING_FAILURE = 'LOAD_LISTENING_FAILURE';
export const LOAD_LISTENING_SUCCESS = 'LOAD_LISTENING_SUCCESS';

export const LISTEN_START = 'LISTEN_START';
export const LISTEN_FAILURE = 'LISTEN_FAILURE';
export const LISTEN_SUCCESS = 'LISTEN_SUCCESS';

export const STOP_LISTEN_START = 'STOP_LISTEN_START';
export const STOP_LISTEN_FAILURE = 'STOP_LISTEN_FAILURE';
export const STOP_LISTEN_SUCCESS = 'STOP_LISTEN_SUCCESS';

// PUSHER

export const PUSHER_NEW_MESSAGE = 'PUSHER_NEW_MESSAGE';
export const PUSHER_NEW_LISTEN = 'PUSHER_NEW_LISTEN';
export const PUSHER_PROFILE_CHANGE = 'PUSHER_PROFILE_CHANGE';

// Forms
export const FORM_SAVE_DRAFT = 'FORM_SAVE_DRAFT';

// User

export const LOAD_PROFILE_START = 'LOAD_PROFILE_START';
export const LOAD_PROFILE_FAILURE = 'LOAD_PROFILE_FAILURE';
export const LOAD_PROFILE_SUCCESS = 'LOAD_PROFILE_SUCCESS';

export const UPDATE_PROFILE_START = 'UPDATE_PROFILE_START';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';

export const LOAD_HOME_SHOUTS_START = 'LOAD_HOME_SHOUTS_START';
export const LOAD_HOME_SHOUTS_SUCCESS = 'LOAD_HOME_SHOUTS_SUCCESS';
export const LOAD_HOME_SHOUTS_FAILURE = 'LOAD_HOME_SHOUTS_FAILURE';

export const LOAD_USER_SHOUTS_START = 'LOAD_USER_SHOUTS_START';
export const LOAD_USER_SHOUTS_SUCCESS = 'LOAD_USER_SHOUTS_SUCCESS';
export const LOAD_USER_SHOUTS_FAILURE = 'LOAD_USER_SHOUTS_FAILURE';

// Search

export const SEARCH_SHOUTS_START = 'SEARCH_SHOUTS_START';
export const SEARCH_SHOUTS_SUCCESS = 'SEARCH_SHOUTS_SUCCESS';
export const SEARCH_SHOUTS_FAILURE = 'SEARCH_SHOUTS_FAILURE';
export const INVALIDATE_SHOUTS_SEARCH = 'INVALIDATE_SHOUTS_SEARCH';

export const SEARCH_PROFILES_START = 'SEARCH_PROFILES_START';
export const SEARCH_PROFILES_SUCCESS = 'SEARCH_PROFILES_SUCCESS';
export const SEARCH_PROFILES_FAILURE = 'SEARCH_PROFILES_FAILURE';

export const SEARCH_TAGS_START = 'SEARCH_TAGS_START';
export const SEARCH_TAGS_SUCCESS = 'SEARCH_TAGS_SUCCESS';
export const SEARCH_TAGS_FAILURE = 'SEARCH_TAGS_FAILURE';

export const INVALIDATE_TAG_SHOUTS = 'INVALIDATE_TAG_SHOUTS';

export const PLACE_PREDICTIONS_START = 'PLACE_PREDICTIONS_START';
export const PLACE_PREDICTIONS_SUCCESS = 'PLACE_PREDICTIONS_SUCCESS';
export const PLACE_PREDICTIONS_FAILURE = 'PLACE_PREDICTIONS_FAILURE';
export const PLACE_PREDICTIONS_RESET_INPUT = 'PLACE_PREDICTIONS_RESET_INPUT';

// Shouts

export const LOAD_SHOUT_START = 'LOAD_SHOUT_START';
export const LOAD_SHOUT_SUCCESS = 'LOAD_SHOUT_SUCCESS';
export const LOAD_SHOUT_FAILURE = 'LOAD_SHOUT_FAILURE';

export const LOAD_RELATED_SHOUTS_START = 'LOAD_RELATED_SHOUTS_START';
export const LOAD_RELATED_SHOUTS_SUCCESS = 'LOAD_RELATED_SHOUTS_SUCCESS';
export const LOAD_RELATED_SHOUTS_FAILURE = 'LOAD_RELATED_SHOUTS_FAILURE';

export const CREATE_SHOUT_START = 'CREATE_SHOUT_START';
export const CREATE_SHOUT_SUCCESS = 'CREATE_SHOUT_SUCCESS';
export const CREATE_SHOUT_FAILURE = 'CREATE_SHOUT_FAILURE';

export const AMEND_SHOUT = 'AMEND_SHOUT';

export const UPDATE_SHOUT_START = 'UPDATE_SHOUT_START';
export const UPDATE_SHOUT_SUCCESS = 'UPDATE_SHOUT_SUCCESS';
export const UPDATE_SHOUT_FAILURE = 'UPDATE_SHOUT_FAILURE';

export const DELETE_SHOUT_START = 'DELETE_SHOUT_START';
export const DELETE_SHOUT_SUCCESS = 'DELETE_SHOUT_SUCCESS';
export const DELETE_SHOUT_FAILURE = 'DELETE_SHOUT_FAILURE';

export const CALL_SHOUT_START = 'CALL_SHOUT_START';
export const CALL_SHOUT_SUCCESS = 'CALL_SHOUT_SUCCESS';
export const CALL_SHOUT_FAILURE = 'CALL_SHOUT_FAILURE';

// Tags

export const LOAD_TAG_START = 'LOAD_TAG_START';
export const LOAD_TAG_SUCCESS = 'LOAD_TAG_SUCCESS';
export const LOAD_TAG_FAILURE = 'LOAD_TAG_FAILURE';

export const LOAD_TAG_SHOUTS_START = 'LOAD_TAG_SHOUTS_START';
export const LOAD_TAG_SHOUTS_SUCCESS = 'LOAD_TAG_SHOUTS_SUCCESS';
export const LOAD_TAG_SHOUTS_FAILURE = 'LOAD_TAG_SHOUTS_FAILURE';

export const LOAD_RELATED_TAGS_START = 'LOAD_RELATED_TAGS_START';
export const LOAD_RELATED_TAGS_SUCCESS = 'LOAD_RELATED_TAGS_SUCCESS';
export const LOAD_RELATED_TAGS_FAILURE = 'LOAD_RELATED_TAGS_FAILURE';

export const LOAD_TAG_LISTENERS_START = 'LOAD_TAG_LISTENERS_START';
export const LOAD_TAG_LISTENERS_SUCCESS = 'LOAD_TAG_LISTENERS_SUCCESS';
export const LOAD_TAG_LISTENERS_FAILURE = 'LOAD_TAG_LISTENERS_FAILURE';

export const LISTEN_TAG_START = 'LISTEN_TAG_START';
export const LISTEN_TAG_SUCCESS = 'LISTEN_TAG_SUCCESS';
export const LISTEN_TAG_FAILURE = 'LISTEN_TAG_FAILURE';

export const STOP_LISTEN_TAG_START = 'STOP_LISTEN_TAG_START';
export const STOP_LISTEN_TAG_SUCCESS = 'STOP_LISTEN_TAG_SUCCESS';
export const STOP_LISTEN_TAG_FAILURE = 'STOP_LISTEN_TAG_FAILURE';

// Server

export const SERVER_STATUS_START = 'SERVER_STATUS_START';
export const SERVER_STATUS_SUCCESS = 'SERVER_STATUS_SUCCESS';
export const SERVER_STATUS_FAILURE = 'SERVER_STATUS_FAILURE';
export const ROUTE_ERROR = 'ROUTE_ERROR';
