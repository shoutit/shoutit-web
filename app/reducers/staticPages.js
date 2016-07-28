import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isFetching: true,
  data: '',
};

export default function (state = null, action) {
  switch (action.type) {
    case actionTypes.LOAD_STATIC_START:
      return initialState;
    case actionTypes.LOAD_STATIC_SUCCESS:
      return {
        isFetching: false,
        data: action.payload,
      };
    case actionTypes.LOAD_STATIC_FAILURE:
      return {
        isFetching: false,
      };
  }

  return state;
}
