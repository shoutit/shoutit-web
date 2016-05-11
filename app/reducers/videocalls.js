import * as actionTypes from '../actions/actionTypes';
import merge from 'lodash/merge';

const initialState = {
  enabled: false,
  incomingInvites: {},  // object by conversationSid's
  outgoingInvite: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.TWILIO_TOKEN_SUCCESS:
      return {
        ...state,
        enabled: true,
      };
    case actionTypes.VIDEOCALL_ADD_INCOMING_INVITE:
      return merge({}, state, {
        incomingInvites: {
          [action.payload.conversationSid]: action.payload,
        },
      });
    case actionTypes.VIDEOCALL_SET_OUTGOING_INVITE:
      return merge({}, state, {
        outgoingInvite: action.payload,
      });
    default: return state;
  }
}
