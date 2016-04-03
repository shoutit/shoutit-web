
import * as actionTypes from './actionTypes';

export function getTwilioToken(id) {
  return {
    types: [
      actionTypes.TWILIO_TOKEN_START,
      actionTypes.TWILIO_TOKEN_SUCCESS,
      actionTypes.TWILIO_TOKEN_FAILURE,
    ],
    payload: { id },
    service: {
      name: 'twilioToken',
      method: 'create',
    },
  };
}

export function addIncomingInvite(incomingInvite) {
  return {
    type: actionTypes.VIDEOCALL_ADD_INCOMING_INVITE,
    payload: incomingInvite,
  };
}

export function setOutgoingInvite(outgoingInvite) {
  return {
    type: actionTypes.VIDEOCALL_SET_OUTGOING_INVITE,
    payload: outgoingInvite,
  };
}

export function startVideocall(user) {
  return {
    type: actionTypes.START_VIDEOCALL,
    payload: user,
  };
}
