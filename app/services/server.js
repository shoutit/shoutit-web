import git from 'git-rev';
let cache;
export default {
  name: 'server',
  read: (req, resource, param, config, callback) => {
    if (cache) {
      callback(null, cache);
      return;
    }
    git.tag(tag => {
      const status = { tag };
      callback(null, status);
      cache = status;
    });
  },
};
