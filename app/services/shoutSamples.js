import ar from '../../assets/samples/shouts.ar.json';
import en from '../../assets/samples/shouts.en.json';

const SHOUTS = { ar, en };

export default {
  name: 'shoutSamples',
  read: (req, resource, params = {}, config, callback) => {
    callback(null, SHOUTS[req.locale].shouts);
  },
};
