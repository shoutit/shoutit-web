import { replace } from 'react-router-redux';

import { closeModal } from '../actions/ui';
import { closeConversation } from '../actions/conversations';
import * as actionTypes from '../actions/actionTypes';

export default store => next => action => { // eslint-disable-line no-unused-vars
  const state = store.getState();

  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      const { pathname } = action.payload;
      if (state.modals.show) {
        store.dispatch(closeModal());
      }
      if (pathname.match(/^\/messages/)) {
        state.chat.openedConversations.map(id =>
          store.dispatch(closeConversation({ id })));
      }
      break;
    case actionTypes.LEAVE_CONVERSATION_START:
      const { conversation } = action.payload;
      if (state.routing.currentUrl === `/messages/${conversation.id}`) {
        store.dispatch(replace('/messages'));
      }
      break;
    default:

  }
  return next(action);
};
