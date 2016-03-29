import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import services from '../middlewares/services';

const noop = store => next => action => next(action); // eslint-disable-line

const pusher = process.env.BROWSER ?
  require('../middlewares/pusher').default : noop;

const router = process.env.BROWSER ?
  require('react-router-redux').routerMiddleware : () => noop;

export default function configureStore(initialState, { fetchr, devToolsExtension, history }) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        services(fetchr),
        pusher,
        thunk,
        // store => next => action => { console.log("dispatching", action); next(action) },
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
