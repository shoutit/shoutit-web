import * as actionTypes from '../actions/actionTypes';

const initialState = {
  status: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SERVER_STATUS_SUCCESS:
      return {
        status: action.payload,
      };
    default: return state;
  }
}
