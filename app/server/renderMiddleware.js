import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import last from 'lodash/last';
import newrelic, { newrelicEnabled } from './newrelic';

import Fetchr from 'fetchr';
import debug from 'debug';

import { routeError } from '../actions/server';
import HtmlDocument from './HtmlDocument';
import configureRoutes from '../routes';

import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

import fetchDataForRoutes from '../utils/fetchDataForRoutes';

const log = debug('shoutit:server:renderMiddleware');

const translationsPath = path.resolve(__dirname, '../../assets/intl/translations');
const noticeError = (e, params) => {
  if (!newrelicEnabled) {
    return;
  }
  log('Notice error to newrelic', e);
  newrelic.noticeError(e, params);
};

export default function renderMiddleware(req, res, next) {
  const fetchr = new Fetchr({ xhrPath: '/fetchr', req });

  fetchr.read('session').end((err, user) => {
    const storeState = {
      routing: {
        currentUrl: req.url,
        query: req.query,
        path: req.path,
      },
      currentLocation: req.geolocation,
      i18n: {
        locale: req.locale,
        rtl: req.locale === 'ar',
        messages: require(`${translationsPath}/${req.locale}.json`),
      },
    };
    if (user) {
      req.session.user = user;
      storeState.session = {
        user: user.id,
      };
      storeState.entities = {
        users: {
          [user.id]: user,
        },
      };
    }
    const store = configureStore(storeState, { fetchr });
    const routes = configureRoutes(store);

    // Run router to determine the desired state
    match({ routes, location: req.url }, (matchError, redirectLocation, renderProps) => {
      log('Matched request for %s', req.url);
      try {

        if (redirectLocation) {
          res.redirect(301, redirectLocation.pathname + redirectLocation.search);
          return;
        }

        if (newrelicEnabled && renderProps.routes) {
          const transactionName = last(renderProps.routes).path.replace(/^\//, '');
          log('Setting newrelic transactionName to %s', transactionName);
          newrelic.setTransactionName(transactionName);
        }

        if (matchError) {
          store.dispatch(routeError(matchError));
        }

        let status = 200;
        if (renderProps.routes && renderProps.routes[renderProps.routes.length - 1].path === '*') {
          status = 404;
        }

        log('Fetching data for routes...');

        fetchDataForRoutes(renderProps.routes, renderProps.params, req.query, store, fetchingError => {
          log('Routes data has been fetched', fetchingError);

          if (fetchingError) {
            store.dispatch(routeError(fetchingError));
          }

          const routingErrorFromStore = store.getState().routing.error;
          if (routingErrorFromStore) {
            if (routingErrorFromStore.statusCode !== 404) {
              noticeError(routingErrorFromStore);
            }
            status = routingErrorFromStore.statusCode || 500;
          }

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
                    <Component { ...props } location={ location } />
                  }
                  { ...renderProps }
                />
              </Provider>
            );
          } catch (e) {
            noticeError(e);
            next(e, req, res);
            return;
          }

          const html = ReactDOMServer.renderToStaticMarkup(
            <HtmlDocument content={ content } initialState={ initialState } />
          );
          res.status(status).send(`<!doctype html>${html}`);
        });
      } catch (e) {
        noticeError(e);
        next(e);
      }
    });
  });
}
