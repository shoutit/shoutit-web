import debug from 'debug';
import isMobile from 'ismobilejs';

const log = debug('shoutit:server:deviceMiddleware');

/**
 * Attach a req.browser string to the request object, detecting
 * the device from the user agent (`smartphone`, `tablet` or `desktop`).
 * As this is a loose detection, a client-side detection should be
 * added to match the real device width.
 */
export default function browserMiddleware(req, res, next) {
  const device = isMobile(req.headers['user-agent']);
  req.browser = { };
  if (device.phone) {
    req.browser.device = 'smartphone';
    if (device.apple && device.apple.phone) {
      req.browser.os = 'ios';
    } else if (device.android && device.android.phone) {
      req.browser.os = 'android';
    }
  } else if (device.tablet) {
    req.browser.device = 'tablet';
  } else {
    req.browser.device = 'desktop';
  }
  log('Device detected', req.browser);
  next();
}
