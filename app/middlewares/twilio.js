/* global Twilio */
import webrtcsupport from 'webrtcsupport';
import debug from 'debug';

import * as actionTypes from '../actions/actionTypes';
import { getTwilioToken, addIncomingInvite, setOutgoingInvite } from '../actions/videocalls';
import { loadUser } from '../actions/users';

const log = debug('shoutit:middleware:twilio');

let conversationsClient;

export default store => next => action => { // eslint-disable-line no-unused-vars
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      log('Initializing Twilio after login...');
      if (!webrtcsupport.support || !Twilio) {
        conversationsClient = undefined;
        log('WebRTC not supported or Twilio SDK not loaded');
        next(action);
        return;
      }
      store.dispatch(getTwilioToken()).then(data => {
        log('Twilio token received for %s', data.identity);

        const accessManager = new Twilio.AccessManager(data.token);
        conversationsClient = new Twilio.Conversations.Client(accessManager);

        conversationsClient.listen().then(
          () => log('Conversation client is listening for invites...'),
          error => console.error(error) // eslint-disable-line
        );

        conversationsClient.on('invite', incomingInvite => {
          store.dispatch(loadUser(incomingInvite.from)).then(
            () => store.dispatch(addIncomingInvite(incomingInvite)),
            error => console.error(error) // eslint-disable-line
          );
        });
      });
      break;
    case actionTypes.START_VIDEOCALL:
      log('Inviting %s to conversation...', action.payload.username);
      const outgoingInvite = conversationsClient.inviteToConversation(action.payload.username);
      store.dispatch(setOutgoingInvite(outgoingInvite));
      break;
  }
  next(action);
};
