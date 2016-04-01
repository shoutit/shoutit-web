import * as actionTypes from '../actions/actionTypes';

const initialState = {
  shout: [],
  shouts: [],
  tags: [],
  users: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_SUGGESTIONS_SUCCESS:
      return action.payload.result;
    default: return state;
  }
}
