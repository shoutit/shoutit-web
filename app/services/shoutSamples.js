import ar from '../../assets/samples/shouts.ar.json';
import de from '../../assets/samples/shouts.de.json';
import en from '../../assets/samples/shouts.en.json';
import es from '../../assets/samples/shouts.es.json';
import zh from '../../assets/samples/shouts.zh.json';

const SHOUTS = { ar, en, de, es, zh };

export default {
  name: 'shoutSamples',
  read: (req, resource, params = {}, config, callback) => {
    callback(null, SHOUTS[req.locale].shouts);
  },
};
