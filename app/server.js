
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import Fetchr from 'fetchr';
import errorDomainMiddleware from 'express-domain-middleware';

// import csurf from 'csurf';

// import smsMiddleware from './server/smsMiddleware';
import basicAuthMiddleware from './server/basicAuthMiddleware';
import browserMiddleware from './server/browserMiddleware';
import errorMiddleware from './server/errorMiddleware';
import fetchrMiddleware, { fetchrPath } from './server/fetchrMiddleware';
import currentLocationMiddleware from './server/currentLocationMiddleware';
import localeMiddleware from './server/localeMiddleware';
import pusherMiddleware from './server/pusherMiddleware';
import Raven, { ravenEnabled } from './server/raven';
import redirects from './server/redirects';
import renderMiddleware from './server/renderMiddleware';
import sessionMiddleware from './server/sessionMiddleware';
import slashMiddleware from './server/slashMiddleware';
import staticMiddleware from './server/staticMiddleware';
import { fileUploadMiddleware, fileDeleteMiddleware } from './server/fileMiddleware';

import * as services from './services';

export default function start(app) {

  if (ravenEnabled) {
    app.use(Raven.requestHandler());
  }
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

  // Serve static files
  staticMiddleware(app);

  // Remove trailing slashes from urls
  app.use(slashMiddleware);

  // Make sure errors are catched without crashing the server
  app.use(errorDomainMiddleware);

  // Set the client's device details in req.browser
  app.use(browserMiddleware);

  // Add fetchr to req object
  fetchrMiddleware(app);

  // Enable redis-based session
  sessionMiddleware(app);

  // Set the session's language
  app.use(localeMiddleware);

  // Register fetchr services
  Object.keys(services).forEach(name => Fetchr.registerService(services[name])); // eslint-disable-line
  app.use(fetchrPath, Fetchr.middleware());

  // Set the session current location
  app.use(currentLocationMiddleware);

  app.post('/api/pusher/auth', pusherMiddleware);
  app.post('/api/file/:resourceType', fileUploadMiddleware);
  app.delete('/api/file/:resourceType', fileDeleteMiddleware);

  // Enable various redirects
  Object.keys(redirects).map(path => app.get(path, redirects[path]));

  // app.get(':smscode', smsMiddleware);
  app.get('*', renderMiddleware);

  if (ravenEnabled) {
    app.use(Raven.errorHandler());
  }
  app.use(errorMiddleware);
}
