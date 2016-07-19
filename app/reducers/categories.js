import shuffle from 'lodash/shuffle';

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

export function getCategory(state, slug) {
  return state.entities.categories[slug];
}

export function getCategories(state) {
  return state.categories.ids.map(id => state.entities.categories[id]);
}
