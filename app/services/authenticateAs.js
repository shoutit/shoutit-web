import debug from 'debug';

const log = debug('shoutit:services:authenticateAs');

export default {
  name: 'authenticateAs',
  create: (req, resource, params, body, config, callback) => {
    if (!req.session || !req.session.profile) {
      callback(new Error('Session does not exists'));
      return;
    }

    req.fetchr.read('profile')
      .params({ username: body.username })
      .end((err, page) => {
        if (err) {
          console.error(err);
          callback(err);
          return;
        }
        if (!page.isOwner) {
          console.error('User is not an owner of %s page', page.username);
        }
        req.session.page = page;
        log('Authenticated with page %s', req.session.page.username);
        callback(null, page);
    });
  },
};
