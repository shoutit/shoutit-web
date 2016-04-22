import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.username,
  mapActionToTempId: action => action.payload.shout.id,
  fetchTypes: [
    actionTypes.LOAD_USER_SHOUTS_START,
    actionTypes.LOAD_USER_SHOUTS_SUCCESS,
    actionTypes.LOAD_USER_SHOUTS_FAILURE,
  ],
  createTypes: [
    actionTypes.CREATE_SHOUT_START,
    actionTypes.CREATE_SHOUT_SUCCESS,
  ],
});
