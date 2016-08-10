import { languages } from '../config';

const SHOUTS = {};

languages.forEach(language => {
  SHOUTS[language] = require(`../../assets/samples/shouts.${language}.json`);
});

export default {
  name: 'shoutSamples',
  read: (req, resource, params = {}, config, callback) => {
    if (!SHOUTS[req.language]) {
      callback(new Error(`Cannot load sample shouts for ${req.language}`));
    }
    callback(null, SHOUTS[req.language].shouts);
  },
};
