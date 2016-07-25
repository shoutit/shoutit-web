/* eslint-env browser */
import debug from 'debug';

import debounce from 'lodash/debounce';

import { BROWSER_SET_DEVICE } from '../actions/actionTypes';
import { smartphone, tablet } from '../constants/deviceWidths';

const log = debug('shoutit:store:browserStoreEnhancer');

function calculateDeviceType(window) {
  const w = window.innerWidth;
  let deviceType = 'desktop';
  if (w <= smartphone.maxWidth) {
    deviceType = 'smartphone';
  } else if (w <= tablet.maxWidth) {
    deviceType = 'tablet';
  }
  log('Detected %s', deviceType);
  return deviceType;
}

function addEventHandler(store) {
  if (typeof window !== 'undefined') {
    const dispatchAction = debounce(
        () => store.dispatch({
          type: BROWSER_SET_DEVICE,
          payload: calculateDeviceType(window),
        })
      );
    dispatchAction();
    window.addEventListener('resize', dispatchAction);
    log('Added listener to resize event');
  }
  return store;
}

/**
 * Creates a store enhancer to detect the device type (smartphone, tablet or desktop)
 * according to the current window's width
 */

export default () => createStore => (...args) => addEventHandler(createStore(...args));
