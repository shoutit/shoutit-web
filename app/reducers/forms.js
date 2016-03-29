import * as actionTypes from '../actions/actionTypes';

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.FORM_SAVE_DRAFT:
      const name = action.payload.name;
      const fields = action.payload.fields;
      return {
        ...state,
        [name]: fields
      };
  }

  return state;
}
