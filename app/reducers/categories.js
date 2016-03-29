import shuffle from 'lodash/collection/shuffle';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  ids: [],
  shuffled: [],
};

export default function (state = initialState, action) {
  switch (action.type) {

    case actionTypes.LOAD_CATEGORIES_SUCCESS:
      return {
        ids: action.payload.result,
        shuffled: shuffle(action.payload.result),
      };

    default: return state;
  }

}
