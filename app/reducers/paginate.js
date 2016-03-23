import merge from "lodash/object/merge";
import union from "lodash/array/union";
import without from "lodash/array/without";

export default function paginate({
  fetchTypes,
  mapActionToKey,

  createTypes=[],
  mapActionToTempId

}) {

  if (!Array.isArray(fetchTypes) || fetchTypes.length !== 3) {
    throw new Error("Expected types to be an array of three elements.");
  }
  if (!fetchTypes.every(t => typeof t === "string")) {
    throw new Error("Expected fetchTypes to be strings.");
  }

  const [ fetchStartType, fetchSuccessType, fetchFailureType ] = fetchTypes;
  const [ createStartType, createSuccessType ] = createTypes;

  function updateOnFetch(state={
    isFetching: false,
    nextUrl: undefined,
    previousUrl: undefined,
    ids: []
  }, action) {
    switch (action.type) {
    case fetchStartType:
      return merge({}, state, {
        isFetching: true
      });
    case fetchSuccessType:
      return merge({}, state, {
        isFetching: false,
        nextUrl: action.payload.nextUrl,
        previousUrl: action.payload.previousUrl,
        ids: union(state.ids, action.payload.result)
      });
    case fetchFailureType:
      return merge({}, state, {
        isFetching: false,
        error: action.payload
      });
    default:
      return state;
    }
  }

  function updateOnCreation(state={
    ids: []
  }, action, tempId) {
    switch (action.type) {
    case createStartType:
      // add temporary item to the list
      return merge({}, state, {
        ids: [...state.ids, tempId]
      });
    case createSuccessType:
      // remove temporary item from the list
      return {...state, ids: without(state.ids, tempId) };
    }
  }

  const initialState = mapActionToKey ? {} : { ids: [] };

  return function updatePaginationByKey(state=initialState, action) {
    switch (action.type) {
    case fetchStartType:
    case fetchSuccessType:
    case fetchFailureType:
      if (mapActionToKey) {
        const key = mapActionToKey(action);
        return merge({}, state, {
          [key]: updateOnFetch(state[key], action)
        });
      }
      return merge({}, state, updateOnFetch(state, action));

    case createStartType:
    case createSuccessType:
      const tempId = mapActionToTempId(action);

      if (mapActionToKey) {
        const key = mapActionToKey(action);
        return {
          ... state,
          [key]: updateOnCreation(state[key], action, tempId)
        };
      }
      return updateOnCreation(state, action, tempId);

    default:
      return state;
    }
  };
}
