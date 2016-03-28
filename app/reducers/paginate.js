import merge from "lodash/object/merge";
import union from "lodash/array/union";
import without from "lodash/array/without";

export default function paginate({
  fetchTypes,
  mapActionToKey,

  createTypes,
  mapActionToTempId,

  addType

}) {

  let fetchStartType;
  let fetchSuccessType;
  let fetchFailureType;
  if (fetchTypes) {
    if (!Array.isArray(fetchTypes) || fetchTypes.length !== 3) {
      throw new Error("Expected types to be an array of three elements");
    }
    if (!fetchTypes.every(t => typeof t === "string")) {
      throw new Error("Expected fetchTypes to be strings");
    }
    [ fetchStartType, fetchSuccessType, fetchFailureType ] = fetchTypes;
  }

  let createStartType;
  let createSuccessType;
  if (createTypes) {
    if (!Array.isArray(createTypes) || createTypes.length !== 2) {
      throw new Error("Expected types to be an array of two elements (one for start action, one for success action)");
    }
    if (!createTypes.every(t => typeof t === "string")) {
      throw new Error("Expected createTypes to be strings.");
    }
    if (typeof mapActionToTempId !== "function") {
      throw new Error("When using createTypes, expected mapActionToTempId to be a function");
    }
    [ createStartType, createSuccessType ] = createTypes;
  }

  if (addType) {
    if (typeof addType !== "string") {
      throw new Error("Expected addType to be a string");
    }
  }

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
      if (!action.payload || !action.payload.result) {
        throw new Error("Expected a payload object with a result containing the entity's id");
      }
      return merge({}, state, {
        isFetching: false,
        nextUrl: action.payload.nextUrl,
        previousUrl: action.payload.previousUrl,
        ids: union(state.ids, action.payload.result)
      });
    case fetchFailureType:
      if (!action.payload || !action.payload) {
        throw new Error("Expected a payload object with an error");
      }
      return merge({}, state, {
        isFetching: false,
        error: action.payload
      });
    default:
      return state;
    }
  }

  function updateOnCreate(state={
    ids: []
  }, action, tempId) {
    switch (action.type) {
    case createStartType:
      // add temporary item to the list
      return merge({}, state, {
        ids: [...state.ids, tempId]
      });
    case createSuccessType:
      if (!action.payload || !action.payload.result) {
        throw new Error("Expected a payload object with a result containing the entity's id");
      }
      // remove temporary item from the list and add the new one
      return {...state, ids: [...without(state.ids, tempId), action.payload.result] };
    }
  }

  function updateOnAdd(state={ids: []}, action) {
    if (!action.payload || !action.payload.result) {
      throw new Error("Expected a payload object with a result containing the entity's id");
    }
    if (action.type === addType) {
      return {...state, ids: [...state.ids, action.payload.result] };
    }
  }

  const initialState = mapActionToKey ? {} : { ids: [] };

  return function updatePaginationByKey(state=initialState, action) {

    if (fetchTypes || createTypes) {
      if (typeof state !== "object") {
        throw new Error("Expected initial state to be an object");
      }
      if (!mapActionToKey && !Array.isArray(state.ids)) {
        throw new Error("Expected initial state to have an array of ids (even empty)");
      }
    }

    switch (action.type) {

    // Detect fetch actions
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

    // Detect create actions
    case createStartType:
    case createSuccessType:
      const tempId = mapActionToTempId(action);

      if (mapActionToKey) {
        const key = mapActionToKey(action);
        return {
          ... state,
          [key]: updateOnCreate(state[key], action, tempId)
        };
      }
      return updateOnCreate(state, action, tempId);

    // Detect add action
    case addType:
      if (mapActionToKey) {
        const key = mapActionToKey(action);
        return {
          ... state,
          [key]: updateOnAdd(state[key], action)
        };
      }
      return updateOnAdd(state, action);

    default:
      return state;
    }
  };
}
