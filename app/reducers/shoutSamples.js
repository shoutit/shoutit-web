import * as actionTypes from '../actions/actionTypes';

const initialState = {
  ids: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_SHOUT_SAMPLES_SUCCESS:
      return {
        ids: action.payload.result,
      };
    default: return state;
  }
}

export function getShoutSamples(state) {
  return state.shoutSamples.ids.map(id => state.entities.shouts[id]);
}
