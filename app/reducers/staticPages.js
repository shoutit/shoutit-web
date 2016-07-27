import * as actionTypes from '../actions/actionTypes';

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_STATIC_START :
      return {
	...state,
      tos: null,//or should we use cached value @gbpl?
      };
  case actionTypes.LOAD_STATIC_SUCCESS :
    console.log()
      return {
	...state,
      tos: payload.result,
      };
    case actionTypes.LOAD_STATIC_FAILURE:
      //how to handle errors from server? is there a specific file and code line you could reference 
      return {
          ...state,
	tos: false,
      };
  default: return state;
  }
}
