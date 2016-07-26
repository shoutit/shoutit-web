import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import services from '../middlewares/services';
import createBrowseStoreEnhancer from './createBrowserStoreEnhancer';
const noop = store => next => action => next(action); // eslint-disable-line

const pusher = process.env.BROWSER ?
  require('../middlewares/pusher').default : noop;

// Disable twilio until we don't restore the videocalls
// const twilio = process.env.BROWSER ?
//   require('../middlewares/twilio').default : noop;

const router = process.env.BROWSER ?
  require('react-router-redux').routerMiddleware : () => noop;

const routing = process.env.BROWSER ?
  require('../middlewares/routing').default : noop;

export default function configureStore(initialState, { fetchr, devToolsExtension, history }) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      createBrowseStoreEnhancer(),
      applyMiddleware(
        services(fetchr),
        routing,
        pusher,
        // twilio,
        thunk,
        router(history)
      ),
      devToolsExtension ? devToolsExtension() : f => f
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
