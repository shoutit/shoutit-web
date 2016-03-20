import { createStore, applyMiddleware, compose } from "redux";

import rootReducer from "../reducers";
import fetchrMiddleware from "../middleware/fetchrMiddleware";

export default function configureStore(initialState, fetchr, devToolsExtension) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(fetchrMiddleware(fetchr)),
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
