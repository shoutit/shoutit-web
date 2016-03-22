
const initialState = {
  currentUrl: undefined
};

export default function(state=initialState, action) {
  if (action.type === "@@router/LOCATION_CHANGE") {
    return {
      ...state,
      currentUrl: `${action.payload.pathname}${action.payload.search}`
    };
  }
  return state;
}
