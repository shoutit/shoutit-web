import React from 'react';
import { match, RouterContext } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import DocumentTitle from 'react-document-title';
import Fetchr from 'fetchr';
import debug from 'debug';

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
      currentLocation: user ? user.location : null,
    }, { fetchr });
    const routes = configureRoutes(store);

    // Run router to determine the desired state
    match({ routes, location: req.url }, (error, redirectLocation, props) => {
      log('Matched request for %s', req.url);

      if (redirectLocation) {
        res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        return;
      }
      if (error) {
        next(error);
        return;
      }

      log('Fetching data for routes...');
      try {
        fetchDataForRoutes(props.routes, props.params, req.query, store, err => {
          if (err) {
            log('Error fetching data for routes');
            next(err);
            return;
          }
          log('Routes data has been fetched');

          const meta = {}; // getMetaFromData(req.url, data);
          const initialState = store.getState();
          log('Initial store state', Object.keys(initialState));
          const location = {
            query: req.query,
            pathname: req.url,
          };
          let content;
          try {
            content = ReactDOMServer.renderToString(
              <Provider store={ store }>
                <RouterContext
                  createElement={ (Component, elProps) =>
                    <Component {...elProps} location={ location } />
                  }
                  {...props}
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
          res.send(`<!doctype html>${html}`);
        });
      } catch (e) {
        next(e);
      }
    });
  });
}
