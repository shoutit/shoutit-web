/* eslint no-console: 0, no-underscore-dangle: 0 */
/* eslint-env browser */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import debug from 'debug';
import Fetchr from 'fetchr';

import * as config from './config';

import configureStore from './store/configureStore';
import { getCurrentLanguage } from './reducers/i18n';

import { initFacebook } from './utils/FacebookUtils';

import initGoogleAnalytics from './client/initGoogleAnalytics';
import { loadIntlPolyfill, loadLanguageData } from './utils/IntlUtils';

import './styles/main.scss';

window.debug = debug;
const log = debug('shoutit');

const fetchr = new Fetchr({ xhrPath: '/fetchr', xhrTimeout: 20000 });

log('Starting client web app', `\n${config.getSummary()}\n`);

const scrollHistory = useScroll(() => browserHistory)();
const store = configureStore(window.__INITIAL_STATE__, {
  fetchr, history: scrollHistory, devToolsExtension: window.devToolsExtension,
});
const history = syncHistoryWithStore(scrollHistory, store);
if (config.ga) {
  const ga = initGoogleAnalytics(config.ga);
  history.listen(location => ga('send', 'pageview', location.pathname));
}
log('Rehydrating store with initial state', window.__INITIAL_STATE__);

initFacebook();

const logRouter = debug('shoutit:router');

let firstRender = true;

const renderApp = () => {
  const configureRoutes = require('./routes').default;

  const routes = configureRoutes(store);
  return (
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
            <RouterContext { ...renderProps }
              createElement={ (Component, elProps) => {
                logRouter('Creating element for %s %s, first render? %s',
                  Component.displayName || Component.name, elProps.location.pathname, _firstRender
                );
                return <Component { ...elProps } firstRender={ _firstRender } />;
              } }
            />
          </Provider>
        );
        firstRender = false;
        return routerContext;
      } }>
      { routes }
    </Router>
  );
};

const language = getCurrentLanguage(store.getState());

loadIntlPolyfill(language)
  .then(() => loadLanguageData(language))
  .then(messages => {
    ReactDOM.render(
      renderApp(messages),
      document.getElementById('content')
    );
  });

