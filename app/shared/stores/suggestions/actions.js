import consts from "./consts";

export default {
  getSuggestions(currentLocation) {
    this.dispatch(consts.GET_SUGGESTIONS, {currentLocation});
  }
};
