export default {
  name: 'server',
  read: (req, resource, param, config, callback) => {
    callback(null, {
      currentTag: process.env.CURRENT_TAG,
    });
  },
};
