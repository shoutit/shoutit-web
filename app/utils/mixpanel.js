/* eslint-env browser */
import debug from 'debug';

const log = debug('shoutit:utils:mixpanel');

export function identifyOnMixpanel(user) {
  if (!window.mixpanel) {
    log('Mixpanel not loaded');
    return;
  }
  window.mixpanel.identify(user.id);
  log('User identified on mixpanel with id %s', user.id);
}

export function getMixpanelId() {
  return window.mixpanel.get_distinct_id();
}

export function trackWithMixpanel(event, properties) {
  if (!window.mixpanel) {
    log('Mixpanel not loaded');
    return;
  }
  properties = {
    ...properties,
    api_client: 'shoutit-web',
  };
  window.mixpanel.track(event, properties);
  log('Tracked event %s', event, properties);
}
