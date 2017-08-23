import { LANGUAGES } from '../config';

const SHOUTS = {};

LANGUAGES.forEach(language => {
  SHOUTS[language] = require(`../../assets/samples/shouts.${language}.json`);
});

export default {
  name: 'shoutSamples',
  read: (req, resource, params = {}, config, callback) => {
    if (!SHOUTS[req.session.language]) {
      callback(new Error(`Cannot load sample shouts for ${req.session.language}`));
    }
    callback(null, SHOUTS[req.session.language].shouts);
  },
};
