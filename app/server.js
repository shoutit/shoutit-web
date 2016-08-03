/* eslint no-console: 0 */
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import Fetchr from 'fetchr';
import serveStatic from 'serve-static';
import errorDomainMiddleware from 'express-domain-middleware';

// import csurf from 'csurf';

// import smsMiddleware from './server/smsMiddleware';
import basicAuthMiddleware from './server/basicAuthMiddleware';
import geolocationMiddleware from './server/geolocationMiddleware';
import errorMiddleware from './server/errorMiddleware';
import pusherMiddleware from './server/pusherMiddleware';
import localeMiddleware from './server/localeMiddleware';
import redirects from './server/redirects';
import renderMiddleware from './server/renderMiddleware';
import browserMiddleware from './server/browserMiddleware';
import sessionMiddleware from './server/sessionMiddleware';
import slashMiddleware from './server/slashMiddleware';
import { fileUploadMiddleware, fileDeleteMiddleware } from './server/fileMiddleware';

import * as services from './services';

const publicDir = path.resolve(__dirname,
  process.env.NODE_ENV === 'production' ? '../public' : '../assets'
);

export function start(app) {

  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // required proxying pusher/auth
  app.use(compression());
  // app.use(csurf({ cookie: true }));

  // Basic authentication
  if (process.env.BASIC_AUTH_USERNAME && process.env.BASIC_AUTH_PASSWORD) {
    app.use(basicAuthMiddleware);
  }

  app.use(favicon(`${publicDir}/images/favicons/favicon.ico`));

  // Enable redis-based session
  sessionMiddleware(app);

  app.use(errorDomainMiddleware);

  // Get the client's locale in req.locale
  app.use(localeMiddleware);

  // Get the client's device in req.browser
  app.use(browserMiddleware);

  // Register fetchr services
  Object.keys(services).forEach(name => Fetchr.registerService(services[name])); // eslint-disable-line
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

  // Remove trailing slashes from urls
  app.use(slashMiddleware);

  // Get the client's geo location
  app.use(geolocationMiddleware);

  // Required by material-ui for server-side rendering: https://github.com/callemall/material-widgets/issues/2356
  app.use((req, res, next) => {
    GLOBAL.navigator = { userAgent: req.headers['user-agent'] };
    next();
  });

  app.post('/api/pusher/auth', pusherMiddleware);
  app.post('/api/file/:resourceType', fileUploadMiddleware);
  app.delete('/api/file/:resourceType', fileDeleteMiddleware);

  // Enable various redirects
  Object.keys(redirects).map(path => app.get(path, redirects[path]));

  // app.get(':smscode', smsMiddleware);
  app.get('*', renderMiddleware);

  app.use(errorMiddleware);
}
