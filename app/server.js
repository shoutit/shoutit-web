/* eslint no-var: 0, no-console: 0 */
import path from 'path';
import consolidate from 'consolidate';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Fetchr from 'fetchr';
import serveStatic from 'serve-static';
import errorDomainMiddleware from 'express-domain-middleware';

import csurf from 'csurf';

import basicAuthMiddleware from './server/basicAuthMiddleware';
import slashMiddleware from './server/slashMiddleware';
import smsMiddleware from './server/smsMiddleware';
import pusherMiddleware from './server/pusherMiddleware';
import renderMiddleware from './server/renderMiddleware';
import errorMiddleware from './server/errorMiddleware';
import useLegacyServices from './server/legacyServices';
import redirects from './server/redirects';

import * as services from './services';

const publicDir = path.resolve(__dirname,
  process.env.NODE_ENV === 'production' ? '../public' : '../assets'
);

export function start(app) {

  // Used by password recovery, should be removed when closing
  // https://github.com/shoutit/shoutit-web/issues/222
  app.engine('jade', consolidate.jade);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/server/views');

  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // required proxying pusher/auth
  app.use(compression());
  // app.use(csurf({ cookie: true }));

  // Basic authentication
  if (process.env.BASIC_AUTH_USERNAME && process.env.BASIC_AUTH_PASSWORD) {
    app.use(basicAuthMiddleware);
  }

  app.use(favicon(`${publicDir}/images/favicons/favicon.ico`));

  // Init redis
  const RedisStore = connectRedis(session);
  app.use(session({
    store: new RedisStore({ db: 11, host: process.env.REDIS_HOST }),
    secret: 'ShoutItOutLoudIntoTheCrowd',
    resave: false,
    saveUninitialized: true,
  }));

  app.use(errorDomainMiddleware);

  // Register fetchr services
  Object.keys(services).forEach(name => Fetchr.registerService(services[name]));
  app.use('/fetchr', Fetchr.middleware());

  // Static assets
  const maxAge = 365 * 24 * 60 * 60;
  if (process.env.NODE_ENV === 'production') {
    app.use('/scripts', serveStatic(`${publicDir}/scripts`, { maxAge }));
    app.use('/images', serveStatic(`${publicDir}/images`, { maxAge }));
    app.use('/styles', serveStatic(`${publicDir}/styles`, { maxAge }));
  } else {
    app.use('/images', serveStatic(`${publicDir}/images`, { maxAge }));
  }

  app.use(slashMiddleware);

  // Required by material-ui for server-side rendering: https://github.com/callemall/material-ui/issues/2356
  app.use((req, res, next) => {
    GLOBAL.navigator = { userAgent: req.headers['user-agent'] };
    next();
  });

  // Enable legacy services (api etc before fetchr)
  useLegacyServices(app);

  app.post('/api/pusher/auth', pusherMiddleware);

  // Enable various redirects
  Object.keys(redirects).map(path => {
    app.get(path, redirects[path]);
  });

  app.get(':smscode', smsMiddleware);
  app.get('*', renderMiddleware);

  app.use(errorMiddleware);
}
