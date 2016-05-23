import * as actionTypes from './actionTypes';

export const saveDraft = (name, fields) => ({
  type: actionTypes.FORM_SAVE_DRAFT,
  payload: {
    name, fields,
  },
});
