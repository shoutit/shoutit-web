import merge from "lodash/object/merge";
import union from "lodash/array/union";

const initialState = {
  isFetching: false,
  next: undefined,
  previous: undefined,
  ids: []
};
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate({ types, mapActionToKey }) {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected types to be an array of three elements.");
  }
  if (!types.every(t => typeof t === "string")) {
    throw new Error("Expected types to be strings.");
  }

  const [ startType, successType, failureType ] = types;

  function updatePagination(state=initialState, action) {
    switch (action.type) {
    case startType:
      return merge({}, state, {
        isFetching: true
      });
    case successType:
      return merge({}, state, {
        isFetching: false,
        ids: union(state.ids, action.payload.result),
        next: action.payload.next,
        previous: action.payload.previous
      });
    case failureType:
      return merge({}, state, {
        isFetching: false,
        error: action.payload
      });
    default:
      return state;
    }
  }

  return function updatePaginationByKey(state=initialState, action) {
    switch (action.type) {
    case startType:
    case successType:
    case failureType:
      if (mapActionToKey) {
        const key = mapActionToKey(action);
        if (typeof key !== "string") {
          throw new Error("Expected key to be a string.");
        }
        return merge({}, state, {
          [key]: updatePagination(state[key], action)
        });
      }
      return merge({}, state, updatePagination(state, action));
    default:
      return state;
    }
  };
}
