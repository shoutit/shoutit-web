import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import DocumentTitle from 'react-document-title';
import Fetchr from 'fetchr';
import debug from 'debug';

import { routeError } from '../actions/server';
import HtmlDocument from './HtmlDocument';
import configureRoutes from '../routes';

import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

import fetchDataForRoutes from '../utils/fetchDataForRoutes';

const log = debug('shoutit:server:renderMiddleware');

export default function renderMiddleware(req, res, next) {
  const fetchr = new Fetchr({ xhrPath: '/fetchr', req });
  // const flux = new Flux(fetchr);

  log('Reading current session...');
  fetchr.read('session').end((err, user) => {
    if (user) {
      log('Logged in as %s', user.username);
      req.session.user = user;
    } else {
      log('User is not logged in');
    }
    const store = configureStore({
      routing: { currentUrl: req.url },
      session: { user },
      currentLocation: user ? user.location : undefined,
    }, { fetchr });
    const routes = configureRoutes(store);

    // Run router to determine the desired state
    match({ routes, location: req.url }, (matchError, redirectLocation, renderProps) => {
      log('Matched request for %s', req.url);

      if (redirectLocation) {
        res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        return;
      }

      if (matchError) {
        store.dispatch(routeError(matchError));
      }

      let status = 200;
      if (renderProps.routes && renderProps.routes[renderProps.routes.length - 1].path === '*') {
        status = 404;
      }

      log('Fetching data for routes...');

      try {
        fetchDataForRoutes(renderProps.routes, renderProps.params, req.query, store, fetchingError => {
          log('Routes data has been fetched', fetchingError);

          if (fetchingError) {
            store.dispatch(routeError(fetchingError));
            status = fetchingError.statusCode || 500;
          }

          const meta = {}; // getMetaFromData(req.url, data);
          const initialState = store.getState();
          const location = {
            query: req.query,
            pathname: req.url,
          };
          let content;
          try {
            content = ReactDOMServer.renderToString(
              <Provider store={ store }>
                <RouterContext
                  createElement={ (Component, props) =>
                    <Component {...props} location={ location } />
                  }
                  {...renderProps}
                />
              </Provider>
            );
          } catch (e) {
            next(e, req, res);
            return;
          }

          const html = ReactDOMServer.renderToStaticMarkup(
            <HtmlDocument
              content={ content }
              initialState={ initialState }
              title={ DocumentTitle.rewind() }
              meta={ meta }
            />
          );
          res.status(status).send(`<!doctype html>${html}`);
        });
      } catch (e) {
        next(e);
      }
    });
  });
}
