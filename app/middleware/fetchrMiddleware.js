import { normalize } from "normalizr";
import { camelizeKeys } from "humps";

import merge from "lodash/object/merge";

export default fetchr => store => next => action => { // eslint-disable-line no-unused-vars
  const { service } = action;

  if (!service) {
    return next(action);
  }

  if (typeof service !== "object") {
    throw new Error("fetchrMiddlware: service must be an object");
  }

  // Read is the default action
  const { method="read", name, types, params, body, schema } = service;

  if (typeof name !== "string") {
    throw new Error("fetchrMiddlware: must specify a fetchr service name");
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected an array of three action types.");
  }
  if (!types.every(type => typeof type === "string")) {
    throw new Error("Expected action types to be strings.");
  }

  function actionWith(data) {
    const finalAction = merge({}, action, data);
    delete finalAction.service;
    return finalAction;
  }

  const [ startType, successType, failureType ] = types;
  next(actionWith({ type: startType }));
  return new Promise(resolve => {
    fetchr[method](name)
      .params(params)
      .body(body)
      .end((err, payload) => {
        if (err) {
          return next(actionWith({
            error: true,
            payload: err.body,
            type: failureType
          }));
        }
        payload = camelizeKeys(payload);
        if (schema) {
          payload = normalize(payload, schema);
        }
        resolve(payload);
        next(actionWith({
          payload,
          type: successType
        }));
      });
  });

};
