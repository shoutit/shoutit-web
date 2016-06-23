import * as actionTypes from '../actions/actionTypes';

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SAVE_SHOUT_DRAFT:
      return action.payload;
    case actionTypes.RESET_SHOUT_DRAFT:
      return null;
    default: return state;
  }
}

export const getShoutDraft = state => state.shoutDraft;
