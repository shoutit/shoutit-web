import * as actionTypes from "./actionTypes";

import { suggestion } from "../schemas";

export function getCurrentLocation() {
  return {
    service: {
      name: "location",
      params: { latlng: "0,0" },
      types: [
        actionTypes.GET_CURRENT_LOCATION_START,
        actionTypes.GET_CURRENT_LOCATION_SUCCESS,
        actionTypes.GET_CURRENT_LOCATION_FAILURE
      ]
    }
  };
}

export function getLocation(latlng) {
  return {
    service: {
      name: "location",
      params: { latlng },
      types: [
        actionTypes.GET_LOCATION_START,
        actionTypes.GET_LOCATION_SUCCESS,
        actionTypes.GET_LOCATION_FAILURE
      ]
    }
  };
}

export function loadSuggestions(location) {
  return {
    service:{
      name: "suggestions",
      params: { location },
      types: [
        actionTypes.LOAD_SUGGESTIONS_START,
        actionTypes.LOAD_SUGGESTIONS_SUCCESS,
        actionTypes.LOAD_SUGGESTIONS_FAILURE
      ],
      schema: suggestion
    }
  };
}
