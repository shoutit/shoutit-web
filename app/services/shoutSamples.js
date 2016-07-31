import { locales } from '../config';

const SHOUTS = {};

locales.forEach(locale => {
  SHOUTS[locale] = require(`../../assets/samples/shouts.${locale}.json`);
});

export default {
  name: 'shoutSamples',
  read: (req, resource, params = {}, config, callback) => {
    if (!SHOUTS[req.locale]) {
      callback(new Error(`Cannot load sample shouts for ${req.locale}`));
    }
    callback(null, SHOUTS[req.locale].shouts);
  },
};
