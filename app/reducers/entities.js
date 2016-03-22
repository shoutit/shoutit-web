import merge from "lodash/object/merge";

const initialState = {
  categories: {},
  conversations: {},
  currencies: {},
  messages: {},
  shouts: {},
  tags: {},
  users: {}
};

export default function(state=initialState, action) {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  return state;
}
