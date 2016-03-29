/* eslint no-console: 0 */
/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import debug from 'debug';
import Fetchr from 'fetchr';
import 'babel-polyfill';

import * as config from './config';

import configureRoutes from './routes';
import Flux from './Flux';
import configureStore from './store/configureStore';

import './client/initFacebook';
import initGoogleAnalytics from './client/initGoogleAnalytics';

import 'styles/main.scss';

injectTapEventPlugin();

window.debug = debug;
const log = debug('shoutit');

const fetchr = new Fetchr({ xhrPath: '/fetchr', xhrTimeout: 20000 });
const flux = new Flux(fetchr);

flux.setDispatchInterceptor((action, dispatch) => {
  ReactDOM.unstable_batchedUpdates(() => dispatch(action));
});

if (window.__state) {
  flux.rehydrate(window.__state);
  log('Flux stores has been rehydrated');
} else {
  console.warn('No data to rehydrate in the flux stores');
}

log('Starting client web app', `\n${config.getSummary()}\n`);

const store = configureStore(window.__INITIAL_STATE__, {
  fetchr, history: browserHistory, devToolsExtension: window.devToolsExtension,
});
const history = syncHistoryWithStore(browserHistory, store);
const routes = configureRoutes(store);
if (config.ga) {
  const ga = initGoogleAnalytics(config.ga);
  history.listen(location => ga('send', 'pageview', location.pathname));
}
log('Rehydrating store with initial state', window.__INITIAL_STATE__);

const logRouter = debug('shoutit:router');

let firstRender = true;
ReactDOM.render(

  <Router
    history={ history }
    render={ renderProps => {
      if (firstRender) {
        logRouter('First time rendering %s...', renderProps.location.pathname, renderProps);
      } else {
        logRouter('Rendering %s...', renderProps.location.pathname, renderProps);
      }
      const _firstRender = firstRender;
      const routerContext = (
        <Provider store={ store }>
          <RouterContext {...renderProps}
            createElement={ (Component, props) => {
              logRouter('Creating element for %s %s, first render? %s',
                Component.displayName || Component.name, props.location.pathname, _firstRender
              );
              return <Component {...props} flux={flux} firstRender={ _firstRender } />;
            }}
          />
        </Provider>
      );
      firstRender = false;
      return routerContext;
    }}>

    { routes }

  </Router>,
  document.getElementById('content'),
  () => log('App has been mounted 🎉')
);
