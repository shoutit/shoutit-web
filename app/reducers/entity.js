import merge from "lodash/object/merge";
import omit from "lodash/object/omit";

export default function({
  name,
  createTypes=[],
  mapActionToTempEntity,
  mapActionToTempId
}) {

  if (!Array.isArray(createTypes)) {
    throw new Error("Expected createTypes to be an array of three elements.");
  }

  const [ createStartType, createSuccessType, createFailureType ] = createTypes;

  if (createTypes.length > 0 && createTypes.length < 2) {
    throw new Error("Expected createTypes to be an array of three elements.");
  }
  if (createTypes.length === 2 && typeof mapActionToTempEntity !== "function") {
    throw new Error("Expected mapActionToTempEntity being a function.");
  }
  if (createTypes.length === 2 && typeof mapActionToTempId !== "function") {
    throw new Error("Expected mapActionToTempId being a function.");
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

  return function(state={}, action) {

    // If the action is a create type, add a temporary entity to track its creation

    if (action.hasOwnProperty("type")) {
      switch (action.type) {
      case createStartType:
      case createFailureType:
        const tempId = mapActionToTempId(action);
        return merge({}, state, {
          [tempId]: updateTempEntity(state[tempId] || mapActionToTempEntity(action), action)
        });
      case createSuccessType:
        return omit(state, mapActionToTempId(action));
      default:
        return state;
      }
    }

    // If the action has the proper entity payload, merge its content

    if (action.hasOwnProperty("payload") &&
        action.payload.hasOwnProperty("entities") &&
        action.payload.entities.hasOwnProperty(name)) {
      return merge({}, state, action.payload.entities[name]);
    }

    return state;
  };

}
