import merge from 'lodash/object/merge';
import omit from 'lodash/object/omit';

export default function ({
  name,
  createTypes,
  mapActionToTempEntity,
  mapActionToTempId
}) {

  let createStartType;
  let createSuccessType;
  let createFailureType;
  if (createTypes) {
    [createStartType, createSuccessType, createFailureType] = createTypes;
    if (!Array.isArray(createTypes) || createTypes.length > 0 && createTypes.length < 2) {
      throw new Error('Expected createTypes to be an array of three elements.');
    }
    if (typeof mapActionToTempEntity !== 'function') {
      throw new Error('When using createTypes, expected mapActionToTempEntity being a function.');
    }
    if (typeof mapActionToTempId !== 'function') {
      throw new Error('When using createTypes, expected mapActionToTempId being a function.');
    }
  }

  function updateTempEntity(tempEntity, action) {
    switch (action.type) {
      case createStartType:
        return merge({}, tempEntity, {
          isCreating: true
        });
      case createFailureType:
        return merge({}, tempEntity, {
          isCreating: false,
          createError: action.payload
        });
      default:
        return tempEntity;
    }
  }

  return function (state = {}, action) {

    // If the action type is a create type, add a temporary entity to track its creation

    if (action.hasOwnProperty('type')) {
      switch (action.type) {
        case createStartType:
        case createFailureType:
          const tempId = mapActionToTempId(action);
          return merge({}, state, {
            [tempId]: updateTempEntity(state[tempId] || mapActionToTempEntity(action), action)
          });
        case createSuccessType:
        // Remove the temp entity and add the new entities
          return merge({}, omit(state, mapActionToTempId(action)), action.payload.entities[name]);
      }
    }

    // If the action has an `entity` payload, merge its content
    if (action.payload && action.payload.entities && action.payload.entities[name]) {
      return merge({}, state, action.payload.entities[name]);
    }

    return state;
  };

}
