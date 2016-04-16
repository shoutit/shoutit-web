import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  error: null,
  lastInput: '',
  predictions: {},
};

export default function placePredictionsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PLACE_PREDICTIONS_START:
      return {
        ...state,
        isFetching: true,
        lastInput: action.payload.input,
        error: null,
      };
    case actionTypes.PLACE_PREDICTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null,
        predictions: {
          ...state.predictions,
          [action.payload.input]: action.payload.predictions,
        },
      };
    case actionTypes.PLACE_PREDICTIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
  }
  return state;
}
