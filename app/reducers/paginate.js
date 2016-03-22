import merge from "lodash/object/merge";
import union from "lodash/array/union";

const initialState = {
  isFetching: false,
  nextUrl: undefined,
  previousUrl: undefined,
  hasNextPage: false,
  hasPreviousPage: false,
  ids: []
};

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.

export default function paginate({ types }) {
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
        nextUrl: action.payload.nextUrl,
        previousUrl: action.payload.previousUrl,
        hasNextPage: !!action.payload.nextUrl,
        hasPreviousPage: !!action.payload.previousUrl,
        ids: action.page === "previous" ?
          union(action.payload.result, state.ids) : // put previous results first
          union(state.ids, action.payload.result)
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
      if (action.paginationId) {
        return merge({}, state, {
          [action.paginationId]: updatePagination(state[action.paginationId], action)
        });
      }
      return merge({}, state, updatePagination(state, action));
    default:
      return state;
    }
  };
}
