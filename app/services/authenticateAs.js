import debug from 'debug';

const log = debug('shoutit:services:authenticateAs');

export default {
  name: 'authenticateAs',
  create: (req, resource, params, body, config, callback) => {
    if (!req.session || !req.session.user) {
      callback(new Error('Session does not exists'));
      return;
    }
    req.session.authorizationPage = {
      id: body.id,
      username: body.username,
    };
    log('Authenticated with page %s', req.session.authorizationPage.username);
    callback();
  },
};
