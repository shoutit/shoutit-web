import { normalize } from 'normalizr';
import debug from 'debug';
import merge from 'lodash/merge';

export default fetchr => store => next => action => { // eslint-disable-line no-unused-vars

  if (!action.service) {
    return next(action);
  }
  const { service, types } = action;
  const log = debug(`shoutit:middlewares:services:${service.name}`);

  if (typeof service !== 'object') {
    throw new Error('fetchrMiddlware: service must be an object');
  }

  const { method = 'read', name, params, body, schema } = service;

  if (typeof name !== 'string') {
    throw new Error('Must specify a fetchr service name');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings');
  }

  function actionWith(data) {
    const finalAction = merge({}, action, data);
    delete finalAction.service;
    return finalAction;
  }

  const [startType, successType, failureType] = types;

  log('Fetching data with %s...', startType, action);

  next(actionWith({ type: startType }));

  return new Promise((resolve, reject) => {
    fetchr[method](name)
      .params(params)
      .body(body)
      .end((err, json) => {
        if (err) {
          const error = err.body || err;
          next(actionWith({
            error: true,
            payload: { error },
            type: failureType,
          }));
          reject(error);
          return;
        }
        let payload = json;
        log('Data has been fetched for %s', successType, payload);
        if (payload) {
          if (schema) {
            // Parse the result according to the schema, eventually adding
            // again the next, previous url
            payload = normalize(payload.results ? payload.results : payload, schema);
            if (json.hasOwnProperty('previous')) {
              payload.previousUrl = json.previous;
            }
            if (json.hasOwnProperty('next')) {
              payload.nextUrl = json.next;
            }
            if (json.hasOwnProperty('count')) {
              payload.count = json.count;
            }
          }
        }

        resolve(payload);
        next(actionWith({
          payload,
          type: successType,
        }));
      });
  });
};
