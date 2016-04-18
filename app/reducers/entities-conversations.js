import * as actionTypes from '../actions/actionTypes';

const initialState = {
  categories: {},
  conversations: {},
  currencies: {},
  messages: {},
  shouts: {},
  tags: {},
  users: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CONVERSATION:
      const id = action.payload;
      if (!id || !state.conversations || !state.conversations[id]) {
        return state;
      }
      return {
        ...state,
        [id]: {
          ...state.conversations[id],
          unreadMessagesCount: 0,
        },
      };
  }
  return state;
}
