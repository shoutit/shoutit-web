import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default createEntityReducer({
  name: 'messages',
  mapActionToTempId: action => action.payload.message.id,
  mapActionToTempEntity: action => action.payload.message,
  createTypes: [
    actionTypes.REPLY_CONVERSATION_START,
    actionTypes.REPLY_CONVERSATION_SUCCESS,
    actionTypes.REPLY_CONVERSATION_FAILURE,
  ],
});
