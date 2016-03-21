import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "../reducers";
import services from "../middlewares/services";

const noop = () => next => action => next(action);

const pusher = process.env.BROWSER ?
  require("../middlewares/pusher").default : noop;

export default function configureStore(initialState, fetchr, devToolsExtension) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        services(fetchr),
        pusher,
        thunk
      ),
      devToolsExtension ? devToolsExtension() : f => f
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers", () => {
      const nextRootReducer = require("../reducers").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
