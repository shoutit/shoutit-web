import debug from 'debug';
import isMobile from 'ismobilejs';

const log = debug('shoutit:server:deviceMiddleware');

/**
 * Attach a req.device string to the request object, detecting
 * the device from the user agent (`smartphone`, `tablet` or `desktop`).
 * As this is a loose detection, a client-side detection should be
 * added to match the real device width.
 */
export default function browserMiddleware(req, res, next) {
  const detectedDevice = isMobile(req.headers['user-agent']);
  if (detectedDevice.phone) {
    req.device = 'smartphone';
  } else if (detectedDevice.tablet) {
    req.device = 'tablet';
  } else {
    req.device = 'desktop';
  }
  log('Device is a %s', req.device);
  next();
}
