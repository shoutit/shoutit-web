import merge from "lodash/object/merge";
import union from "lodash/array/union";

// Creates a reducer managing miscenllaneus entities, given the action types
// to handle,and a function telling how to extract the key from an action.
export default function({ types }) {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected types to be an array of three elements.");
  }
  if (!types.every(t => typeof t === "string")) {
    throw new Error("Expected types to be strings.");
  }

  const [ startType, successType, failureType ] = types;

  function updateMisc(state = {
    isFetching: false,
    ids: []
  }, action) {
    switch (action.type) {
    case startType:
      return merge({}, state, {
        isFetching: true
      });
    case successType:
      return merge({}, state, {
        isFetching: false,
        ids: union(state.ids, action.payload.result)
      });
    case failureType:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
    }
  }

  return function updateMiscByKey(state={}, action) {
    switch (action.type) {
    case startType:
    case successType:
    case failureType:
      return merge({}, state, updateMisc(state, action));
    default:
      return state;
    }
  };
}
