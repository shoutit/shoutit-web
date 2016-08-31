
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

export const UPDATE_LINKED_ACCOUNT_START = 'UPDATE_LINKED_ACCOUNT_START';
export const UPDATE_LINKED_ACCOUNT_SUCCESS = 'UPDATE_LINKED_ACCOUNT_SUCCESS';
export const UPDATE_LINKED_ACCOUNT_FAILURE = 'UPDATE_LINKED_ACCOUNT_FAILURE';

export const SESSION_AUTHENTICATE_AS_START = 'SESSION_AUTHENTICATE_AS_START';
export const SESSION_AUTHENTICATE_AS_SUCCESS = 'SESSION_AUTHENTICATE_AS_SUCCESS';
export const SESSION_AUTHENTICATE_AS_FAILURE = 'SESSION_AUTHENTICATE_AS_FAILURE';

export const SESSION_CANCEL_AUTHENTICATION_START = 'SESSION_CANCEL_AUTHENTICATION_START';
export const SESSION_CANCEL_AUTHENTICATION_SUCCESS = 'SESSION_CANCEL_AUTHENTICATION_SUCCESS';
export const SESSION_CANCEL_AUTHENTICATION_FAILURE = 'SESSION_CANCEL_AUTHENTICATION_FAILURE';

export const SESSION_UPDATE_START = 'SESSION_UPDATE_START';
export const SESSION_UPDATE_SUCCESS = 'SESSION_UPDATE_SUCCESS';
export const SESSION_UPDATE_FAILURE = 'SESSION_UPDATE_FAILURE';

// Notifications
export const LOAD_NOTIFICATIONS_START = 'LOAD_NOTIFICATIONS_START';
export const LOAD_NOTIFICATIONS_SUCCESS = 'LOAD_NOTIFICATIONS_SUCCESS';
export const LOAD_NOTIFICATIONS_FAILURE = 'LOAD_NOTIFICATIONS_FAILURE';

export const RESET_NOTIFICATIONS_START = 'RESET_NOTIFICATIONS_START';
export const RESET_NOTIFICATIONS_SUCCESS = 'RESET_NOTIFICATIONS_SUCCESS';
export const RESET_NOTIFICATIONS_FAILURE = 'RESET_NOTIFICATIONS_FAILURE';

export const READ_NOTIFICATION_START = 'READ_NOTIFICATION_START';
export const READ_NOTIFICATION_SUCCESS = 'READ_NOTIFICATION_SUCCESS';
export const READ_NOTIFICATION_FAILURE = 'READ_NOTIFICATION_FAILURE';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

// Chat

export const CONVERSATIONS_LOAD_START = 'CONVERSATIONS_LOAD_START';
export const CONVERSATIONS_LOAD_SUCCESS = 'CONVERSATIONS_LOAD_SUCCESS';
export const CONVERSATIONS_LOAD_FAILURE = 'CONVERSATIONS_LOAD_FAILURE';

export const PUBLIC_CHATS_LOAD_START = 'PUBLIC_CHATS_LOAD_START';
export const PUBLIC_CHATS_LOAD_SUCCESS = 'PUBLIC_CHATS_LOAD_SUCCESS';
export const PUBLIC_CHATS_LOAD_FAILURE = 'PUBLIC_CHATS_LOAD_FAILURE';

export const CONVERSATION_LOAD_START = 'CONVERSATION_LOAD_START';
export const CONVERSATION_LOAD_SUCCESS = 'CONVERSATION_LOAD_SUCCESS';
export const CONVERSATION_LOAD_FAILURE = 'CONVERSATION_LOAD_FAILURE';

export const LOAD_MESSAGES_START = 'LOAD_MESSAGES_START';
export const LOAD_MESSAGES_SUCCESS = 'LOAD_MESSAGES_SUCCESS';
export const LOAD_MESSAGES_FAILURE = 'LOAD_MESSAGES_FAILURE';

export const READ_MESSAGE_START = 'READ_MESSAGE_START';
export const READ_MESSAGE_SUCCESS = 'READ_MESSAGE_SUCCESS';
export const READ_MESSAGE_FAILURE = 'READ_MESSAGE_FAILURE';
export const SET_MESSAGE_READ_BY = 'SET_MESSAGE_READ_BY';

export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const CONVERSATION_SET_ACTIVE = 'CONVERSATION_SET_ACTIVE';
export const CONVERSATION_UNSET_ACTIVE = 'CONVERSATION_UNSET_ACTIVE';

export const CONVERSATION_LEAVE_START = 'CONVERSATION_LEAVE_START';
export const CONVERSATION_LEAVE_SUCCESS = 'CONVERSATION_LEAVE_SUCCESS';
export const CONVERSATION_LEAVE_FAILURE = 'CONVERSATION_LEAVE_FAILURE';

export const CONVERSATION_OPEN = 'CONVERSATION_OPEN';
export const CONVERSATION_BEGIN = 'CONVERSATION_BEGIN';
export const CONVERSATION_CLOSE = 'CONVERSATION_CLOSE';

export const CONVERSATION_CREATE_START = 'CONVERSATION_CREATE_START';
export const CONVERSATION_CREATE_SUCCESS = 'CONVERSATION_CREATE_SUCCESS';
export const CONVERSATION_CREATE_FAILURE = 'CONVERSATION_CREATE_FAILURE';

export const CONVERSATION_READ_START = 'CONVERSATION_READ_START';
export const CONVERSATION_READ_SUCCESS = 'CONVERSATION_READ_SUCCESS';
export const CONVERSATION_READ_FAILURE = 'CONVERSATION_READ_FAILURE';

export const CONVERSATION_MARK_READ = 'CONVERSATION_MARK_READ';

export const CONVERSATION_MARK_UNREAD_START = 'CONVERSATION_MARK_UNREAD_START';
export const CONVERSATION_MARK_UNREAD_SUCCESS = 'CONVERSATION_MARK_UNREAD_SUCCESS';
export const CONVERSATION_MARK_UNREAD_FAILURE = 'CONVERSATION_MARK_UNREAD_FAILURE';

export const CONVERSATION_REPLACE = 'CONVERSATION_REPLACE';

// Chat notifications

export const CHAT_RECEIVE_TYPING_NOTIFICATION = 'CHAT_RECEIVE_TYPING_NOTIFICATION';
export const CHAT_START_TYPING = 'CHAT_START_TYPING';
export const CHAT_STOP_TYPING = 'CHAT_STOP_TYPING';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';

export const CONVERSATION_REPLY_START = 'CONVERSATION_REPLY_START';
export const CONVERSATION_REPLY_FAILURE = 'CONVERSATION_REPLY_FAILURE';
export const CONVERSATION_REPLY_SUCCESS = 'CONVERSATION_REPLY_SUCCESS';

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

export const DISCOVERITEM_LOAD_START = 'DISCOVERITEM_LOAD_START';
export const DISCOVERITEM_LOAD_SUCCESS = 'DISCOVERITEM_LOAD_SUCCESS';
export const DISCOVERITEM_LOAD_FAILURE = 'DISCOVERITEM_LOAD_FAILURE';

export const DISCOVERITEMS_LOAD_START = 'DISCOVERITEMS_LOAD_START';
export const DISCOVERITEMS_LOAD_SUCCESS = 'DISCOVERITEMS_LOAD_SUCCESS';
export const DISCOVERITEMS_LOAD_FAILURE = 'DISCOVERITEMS_LOAD_FAILURE';

export const DISCOVERITEMS_SHOUTS_LOAD_START = 'DISCOVERITEMS_SHOUTS_LOAD_START';
export const DISCOVERITEMS_SHOUTS_LOAD_SUCCESS = 'DISCOVERITEMS_SHOUTS_LOAD_SUCCESS';
export const DISCOVERITEMS_SHOUTS_LOAD_FAILURE = 'DISCOVERITEMS_SHOUTS_LOAD_FAILURE';

// Geolocation

export const CURRENTLOCATION_UPDATE_START = 'CURRENTLOCATION_UPDATE_START';
export const CURRENTLOCATION_UPDATE_SUCCESS = 'CURRENTLOCATION_UPDATE_SUCCESS';
export const CURRENTLOCATION_UPDATE_FAILURE = 'CURRENTLOCATION_UPDATE_FAILURE';

export const GEOCODE_COORDINATES_START = 'GEOCODE_COORDINATES_START';
export const GEOCODE_COORDINATES_SUCCESS = 'GEOCODE_COORDINATES_SUCCESS';
export const GEOCODE_COORDINATES_FAILURE = 'GEOCODE_COORDINATES_FAILURE';


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

export const LOAD_LISTENING_PROFILES_START = 'LOAD_LISTENING_PROFILES_START';
export const LOAD_LISTENING_PROFILES_FAILURE = 'LOAD_LISTENING_PROFILES_FAILURE';
export const LOAD_LISTENING_PROFILES_SUCCESS = 'LOAD_LISTENING_PROFILES_SUCCESS';

export const LOAD_LISTENING_TAGS_START = 'LOAD_LISTENING_TAGS_START';
export const LOAD_LISTENING_TAGS_FAILURE = 'LOAD_LISTENING_TAGS_FAILURE';
export const LOAD_LISTENING_TAGS_SUCCESS = 'LOAD_LISTENING_TAGS_SUCCESS';


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

export const LOAD_PROFILE_SHOUTS_START = 'LOAD_PROFILE_SHOUTS_START';
export const LOAD_PROFILE_SHOUTS_SUCCESS = 'LOAD_PROFILE_SHOUTS_SUCCESS';
export const LOAD_PROFILE_SHOUTS_FAILURE = 'LOAD_PROFILE_SHOUTS_FAILURE';

export const LOAD_PROFILE_PAGES_START = 'LOAD_PROFILE_PAGES_START';
export const LOAD_PROFILE_PAGES_FAILURE = 'LOAD_PROFILE_PAGES_FAILURE';
export const LOAD_PROFILE_PAGES_SUCCESS = 'LOAD_PROFILE_PAGES_SUCCESS';


export const UPDATE_PROFILE_STATS = 'UPDATE_PROFILE_STATS';
export const REPLACE_PROFILE = 'REPLACE_PROFILE';

// Search
export const INVALIDATE_SEARCH = 'INVALIDATE_SEARCH';
export const SEARCH_START = 'SEARCH_START';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

export const INVALIDATE_SHOUTS_SEARCH = 'INVALIDATE_SHOUTS_SEARCH';

export const SEARCH_SHOUTS_START = 'SEARCH_SHOUTS_START';
export const SEARCH_SHOUTS_SUCCESS = 'SEARCH_SHOUTS_SUCCESS';
export const SEARCH_SHOUTS_FAILURE = 'SEARCH_SHOUTS_FAILURE';

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

export const LOAD_SHOUTS_START = 'LOAD_SHOUTS_START';
export const LOAD_SHOUTS_SUCCESS = 'LOAD_SHOUTS_SUCCESS';
export const LOAD_SHOUTS_FAILURE = 'LOAD_SHOUTS_FAILURE';

export const LOAD_SHOUT_START = 'LOAD_SHOUT_START';
export const LOAD_SHOUT_SUCCESS = 'LOAD_SHOUT_SUCCESS';
export const LOAD_SHOUT_FAILURE = 'LOAD_SHOUT_FAILURE';

export const LOAD_SHOUT_SAMPLES_START = 'LOAD_SHOUT_SAMPLES_START';
export const LOAD_SHOUT_SAMPLES_SUCCESS = 'LOAD_SHOUT_SAMPLES_SUCCESS';
export const LOAD_SHOUT_SAMPLES_FAILURE = 'LOAD_SHOUT_SAMPLES_FAILURE';


export const LOAD_RELATED_SHOUTS_START = 'LOAD_RELATED_SHOUTS_START';
export const LOAD_RELATED_SHOUTS_SUCCESS = 'LOAD_RELATED_SHOUTS_SUCCESS';
export const LOAD_RELATED_SHOUTS_FAILURE = 'LOAD_RELATED_SHOUTS_FAILURE';

export const CREATE_SHOUT_START = 'CREATE_SHOUT_START';
export const CREATE_SHOUT_SUCCESS = 'CREATE_SHOUT_SUCCESS';
export const CREATE_SHOUT_FAILURE = 'CREATE_SHOUT_FAILURE';

export const SAVE_SHOUT_DRAFT = 'SAVE_SHOUT_DRAFT';
export const RESET_SHOUT_DRAFT = 'RESET_SHOUT_DRAFT';

export const UPDATE_SHOUT_START = 'UPDATE_SHOUT_START';
export const UPDATE_SHOUT_SUCCESS = 'UPDATE_SHOUT_SUCCESS';
export const UPDATE_SHOUT_FAILURE = 'UPDATE_SHOUT_FAILURE';

export const DELETE_SHOUT_START = 'DELETE_SHOUT_START';
export const DELETE_SHOUT_SUCCESS = 'DELETE_SHOUT_SUCCESS';
export const DELETE_SHOUT_FAILURE = 'DELETE_SHOUT_FAILURE';

export const CALL_SHOUT_START = 'CALL_SHOUT_START';
export const CALL_SHOUT_SUCCESS = 'CALL_SHOUT_SUCCESS';
export const CALL_SHOUT_FAILURE = 'CALL_SHOUT_FAILURE';

export const LOAD_SORT_TYPES_START = 'LOAD_SORT_TYPES_START';
export const LOAD_SORT_TYPES_SUCCESS = 'LOAD_SORT_TYPES_SUCCESS';
export const LOAD_SORT_TYPES_FAILURE = 'LOAD_SORT_TYPES_FAILURE';


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

// Browser

export const BROWSER_SET_DEVICE = 'BROWSER_SET_DEVICE';

// Static

export const LOAD_STATIC_HTML_START = 'LOAD_STATIC_HTML_START';
export const LOAD_STATIC_HTML_SUCCESS = 'LOAD_STATIC_HTML_SUCCESS';
export const LOAD_STATIC_HTML_FAILURE = 'LOAD_STATIC_HTML_FAILURE';
