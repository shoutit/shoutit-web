import { responsiveStateReducer } from 'redux-responsive';

export default responsiveStateReducer;

export const getBrowser = state => state.browser;
export const getDevice = state => {
  if (state.browser.lessThanOrEqual.small) {
    return 'mobile';
  }
  return 'desktop';
};
