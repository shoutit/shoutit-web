import { combineReducers } from 'redux';

import entity from './entity';
import * as actionTypes from '../actions/actionTypes';

export default combineReducers({
  categories: entity({ name: 'categories' }),
  currencies: entity({ name: 'currencies' }),
  tags: entity({ name: 'tags' }),

  users: entity({
    name: 'users',
    mapActionToId: action => action.payload.profile.id,
    updateTypes: [
      actionTypes.UPDATE_PROFILE_START,
      actionTypes.UPDATE_PROFILE_SUCCESS,
      actionTypes.UPDATE_PROFILE_FAILURE,
    ],
  }),

  discoverItems: entity({ name: 'discoverItems' }),

  shouts: (state, action) => {
    let newState = entity({
      name: 'shouts',
      mapActionToId: action => action.payload.shout.id,
      mapActionToTempId: action => action.payload.shout.id,
      mapActionToTempEntity: action => action.payload.shout,
      createTypes: [
        actionTypes.CREATE_SHOUT_START,
        actionTypes.CREATE_SHOUT_SUCCESS,
        actionTypes.CREATE_SHOUT_FAILURE,
      ],
      updateTypes: [
        actionTypes.UPDATE_SHOUT_START,
        actionTypes.UPDATE_SHOUT_SUCCESS,
        actionTypes.UPDATE_SHOUT_FAILURE,
      ],
      deleteTypes: [
        actionTypes.DELETE_SHOUT_START,
        actionTypes.DELETE_SHOUT_SUCCESS,
        actionTypes.DELETE_SHOUT_FAILURE,
      ],
    })(state, action);

    let id;
    switch (action.type) {
      case actionTypes.CALL_SHOUT_START:
        id = action.payload.id;
        newState = {
          ...newState,
          [id]: {
            ...newState[id],
            isCalling: true,
          },
        };
        break;
      case actionTypes.CALL_SHOUT_SUCCESS:
        id = action.payload.id;
        newState = {
          ...newState,
          [id]: {
            ...newState[id],
            mobile: action.payload.mobile,
            isCalling: false,
          },
        };
        break;
      case actionTypes.CALL_SHOUT_FAILURE:
        id = action.payload.id;
        newState = {
          ...newState,
          [id]: {
            ...newState[id],
            isCalling: false,
          },
        };
        break;
    }
    return newState;
  },
  conversations: (state, action) => {
    let newState = entity({
      name: 'conversations',
      mapActionToTempId: action => action.payload.conversation.id,
      mapActionToTempEntity: action => action.payload.conversation,
      createTypes: [
        actionTypes.CREATE_CONVERSATION_START,
        actionTypes.CREATE_CONVERSATION_SUCCESS,
        actionTypes.CREATE_CONVERSATION_FAILURE,
      ],
    })(state, action);

    switch (action.type) {
      case actionTypes.SET_CURRENT_CONVERSATION:
        const id = action.payload;
        if (!id || !newState || !newState[id]) {
          return state;
        }
        newState = {
          ...newState,
          [id]: {
            ...newState[id],
            unreadMessagesCount: 0,
          },
        };
    }
    return newState;
  },

  messages: entity({
    name: 'messages',
    mapActionToTempId: action => action.payload.message.id,
    mapActionToTempEntity: action => action.payload.message,
    createTypes: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE,
    ],
  }),

});
