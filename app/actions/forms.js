import * as actionTypes from "./actionTypes";

export function saveDraft(name, fields) {
  return {
    type: actionTypes.FORM_SAVE_DRAFT,
    payload: {
      name, fields
    }
  };
}
