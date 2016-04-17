import merge from 'lodash/object/merge';
import omit from 'lodash/object/omit';

export default function ({
  name,
  createTypes,
  updateTypes,
  mapActionToId,
  mapActionToTempEntity,
  mapActionToTempId,
}) {

  let createStartType;
  let createSuccessType;
  let createFailureType;

  let updateStartType;
  let updateSuccessType;
  let updateFailureType;

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

  if (updateTypes) {
    [updateStartType, updateSuccessType, updateFailureType] = updateTypes;
    if (!Array.isArray(updateTypes) || updateTypes.length > 0 && updateTypes.length < 2) {
      throw new Error('Expected updateTypes to be an array of three elements.');
    }
    if (typeof mapActionToId !== 'function') {
      throw new Error('When using updateTypes, expected mapActionToId being a function.');
    }
  }

  function updateTempEntity(tempEntity, action) {
    switch (action.type) {
      case createStartType:
        return merge({}, tempEntity, {
          isCreating: true,
          createError: tempEntity.createError ? null : undefined,
        });
      case createFailureType:
        return merge({}, tempEntity, {
          isCreating: false,
          createError: action.payload.error || action.payload,
        });
      default:
        return tempEntity;
    }
  }

  function updateEntity(entity, action) {
    switch (action.type) {
      case updateStartType:
        return merge({}, entity, {
          isUpdating: true,
          updateError: entity.updateError ? null : undefined,
        });
      case updateSuccessType:
        return merge({}, entity, {
          isUpdating: false,
          updateError: entity.updateError ? null : undefined,
        });
      case updateFailureType:
        return merge({}, entity, {
          isUpdating: false,
          updateError: action.payload.error || action.payload,
        });
      default:
        return entity;
    }
  }

  return function entityReducer(state = {}, action) {
    if (action.hasOwnProperty('type')) {
      switch (action.type) {
        case createStartType:
        case createFailureType:
          // If the action type is a create type, add a temporary entity to track its creation
          const tempId = mapActionToTempId(action);
          return merge({}, state, {
            [tempId]: updateTempEntity(state[tempId] || mapActionToTempEntity(action), action),
          });
        case createSuccessType:
          // Remove the temp entity and add the new entity
          return merge({}, omit(state, mapActionToTempId(action)), action.payload.entities[name]);
        case updateStartType:
        case updateFailureType:
          const id = mapActionToId(action);
          return merge({}, state, {
            [id]: updateEntity(state[id], action),
          });
        case updateSuccessType:
          const updatedId = mapActionToId(action);
          return merge({}, state, {
            [updatedId]: updateEntity(action.payload.entities[name][updatedId], action),
          });
      }
    }

    // If the action has an `entity` payload, merge its content
    if (action.payload && action.payload.entities && action.payload.entities[name]) {
      return merge({}, state, action.payload.entities[name]);
    }

    return state;
  };
}
