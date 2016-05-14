import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default (state, action) => {
  let newState = createEntityReducer({
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
};
