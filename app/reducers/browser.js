import * as actionTypes from '../actions/actionTypes';

const initialState = {
  device: undefined,
  os: undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.BROWSER_SET_DEVICE:
      return {
        ...state,
        device: action.payload,
      };
  }
  return state;
}

export const getDevice = state => state.browser.device;
export const getOperatingSystem = state => state.browser.os;
