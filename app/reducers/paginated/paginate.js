import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import isInteger from 'lodash/isInteger';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import get from 'lodash/get';

import { denormalize } from '../../schemas';

function validatePayload(action) {
  if (!isObject(action.payload)) {
    throw new Error(`Expected the payload for ${action.type} to be an object`);
  }
}

function validateQuery(action) {
  if (!isObject(action.payload.query)) {
    throw new Error(`Expected the query for ${action.type} to be an object`);
  }
  if (!isInteger(action.payload.query.page)) {
    throw new Error(`Page number for ${action.type} must be an integer`);
  }
  if (!isInteger(action.payload.query.page_size)) {
    throw new Error(`Page size for ${action.type} must be an iteger`);
  }
  if (!isUndefined(action.payload.query.sort) && !isString(action.payload.query.sort)) {
    throw new Error(`Sort value for ${action.type} must be a string`);
  }
}

function validateCount(action) {
  if (!isInteger(action.payload.count)) {
    throw new Error(`Count for ${action.type} must be an integer`);
  }
}

function validateResult(action) {
  if (!isArray(action.payload.result)) {
    throw new Error(`Payload result for ${action.type} must be an array`);
  }
}

function validateError(action) {
  if (!isUndefined(action.payload.error)) {
    throw new Error(`Missing error value in payload for ${action.type}`);
  }
}

function handleStartAction(state, action) {
  validatePayload(action);
  validateQuery(action);
  const { query } = action.payload;
  const newState = { ...state };

  if (query.sort !== state.query.sort) {
    // sort changed, pages are not valid anymore
    newState.pages = {};
  } else if (!isEqual(
    omit(query, ['page', 'page_size']),
    omit(state.query, ['page', 'page_size'])
  )) {
    // other query values did change, reset pages and count as they are not valid anymore
    newState.pages = {};
    delete newState.count;
  }

  let isFetching = true;
  let ids = [];
  if (newState.pages[query.page]) {
    isFetching = false;
    ids = newState.pages[query.page].ids;
  } else if (newState.pages[state.query.page]) {
    // use results from the current page
    ids = newState.pages[state.query.page].ids;
  }

  return {
    ...newState,
    query,
    pages: {
      ...newState.pages,
      [query.page]: {
        ...newState.pages[query.page],
        ids,
        isFetching,
        error: undefined,
      },
    },
  };
}

function handleSuccessAction(state, action) {
  validateQuery(action);
  validateCount(action);
  validateResult(action);
  if (!isEqual(action.payload.query, state.query)) {
    // Ignore success for a previous query
    return state;
  }
  return {
    ...state,
    nextUrl: action.payload.nextUrl,
    previousUrl: action.payload.previousUrl,
    count: action.payload.count,
    pages: {
      ...state.pages,
      [action.payload.query.page]: {
        isFetching: false,
        ids: action.payload.result,
      },
    },
  };
}

function handleFailureAction(state, action) {
  validateQuery(action);
  validateError(action);
  const { page } = action.payload.query;
  if (!isEqual(action.payload.query, state.query)) {
    // Ignore success for a previous query
    return state;
  }
  return {
    ...state,
    pages: {
      ...state.pages,
      [page]: {
        ...state.pages[page],
        isFetching: false,
        error: action.payload.error,
      },
    },
  };
}

const initialState = {
  query: {},
  pages: {},
};

export default function paginate({ actionTypes, mapActionToKey }) {
  const [startType, successType, failureType] = actionTypes;

  return function paginatedReducer(state, action) {
    if (!state) {
      if (!mapActionToKey) {
        state = initialState;
      } else {
        state = {};
      }
      return state;
    }
    if (actionTypes.indexOf(action.type) === -1) {
      return state;
    }
    switch (action.type) {
      case startType:
        state = handleStartAction(state, action);
        break;
      case successType:
        state = handleSuccessAction(state, action);
        break;
      case failureType:
        state = handleFailureAction(state, action);
        break;
    }
    if (mapActionToKey) {
      return {
        [mapActionToKey(action)]: state,
      };
    }
    return state;
  };
}

export function getPagination(state, selector) {
  const keys = ['nextUrl', 'previousUrl', 'count', 'page_size', 'sort'];
  return pick(get(state.paginated, selector), keys);
}

export function getPageState(state, page, selector) {
  return pick(get(state.paginated, `${selector}.pages.${page}`), ['isFetching', 'error']);
}
export function getEntities(state, entity, page, schema) {
  return denormalize(
    state.paginated[entity].pages[page] ?
    state.paginated[entity].pages[page].ids :
    [],
    state.entities, schema
  );
}
