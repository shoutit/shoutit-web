import { normalize } from "normalizr";
import { camelizeKeys } from "humps";

import merge from "lodash/object/merge";

export default fetchr => store => next => action => { // eslint-disable-line no-unused-vars

  if (!action.service) {
    return next(action);
  }

  const { service, types, page="first", paginationId } = action;

  if (typeof service !== "object") {
    throw new Error("fetchrMiddlware: service must be an object");
  }

  const { method="read", name, params, body, schema } = service;

  if (typeof name !== "string") {
    throw new Error("Must specify a fetchr service name");
  }
  if (page !== "first" && page !== "previous" && page !== "next") {
    throw new Error(`Expected page being one of 'first', 'previous' or 'next', was ${page}`);
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

    const fetchrParams = {...params};

    if (page && page !== "first") {
      const state = store.getState();
      const key = schema.getItemSchema().getKey();
      let pagination = state.pagination[key];
      if (paginationId) {
        pagination = pagination[paginationId];
      }
      if (!pagination) {
        throw new Error(`Pagination not available for ${key}`);
      }
      let endpoint;
      if (page === "previous") {
        endpoint = pagination.previousUrl;
      } else if (page === "next") {
        endpoint = pagination.nextUrl;
      }
      if (!endpoint) {
        throw new Error(`Endpoint not available for ${page} page. Make sure previousUrl or nextUrl are set before fetching this page.`);
      }
      fetchrParams.endpoint = endpoint;
    }

    fetchr[method](name)
      .params(fetchrParams)
      .body(body)
      .end((err, json) => {

        if (err) {
          return next(actionWith({
            error: true,
            payload: err.body,
            type: failureType
          }));
        }
        let payload = camelizeKeys(json);

        if (schema) {
          payload = normalize(payload.results ? payload.results : payload, schema);
          payload.previousUrl = json.previous;
          payload.nextUrl = json.next;
        }

        resolve(payload);
        next(actionWith({
          payload,
          type: successType
        }));

      });

  });

};
