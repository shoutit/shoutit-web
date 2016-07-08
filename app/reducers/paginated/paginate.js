import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import isInteger from 'lodash/isInteger';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import pick from 'lodash/pick';
import get from 'lodash/get';

import debug from 'debug';
const log = debug('shoutit:reducers:paginate');

function validatePayload(action) {
  if (!isObject(action.payload)) {
    throw new Error(`Expected the payload for ${action.type} to be an object`);
  }
}

function validateQuery(action) {
  if (action.payload.query && !isObject(action.payload.query)) {
    throw new Error(`Expected the query for ${action.type} to be an object`);
  }
}

function validatePagination(action) {
  if (!isObject(action.payload.pagination)) {
    throw new Error(`Expected a pagination object for ${action.type} action payload`);
  }
}

function validatePageNumber(action) {
  if (!isInteger(action.payload.pagination.page)) {
    throw new Error(`Page number for ${action.type} must be an integer`);
  }
}

function validatePageSize(action) {
  if (!isInteger(action.payload.pagination.page_size)) {
    throw new Error(`Page size for ${action.type} must be an iteger`);
  }
}

function validateSort(action) {
  if (!isUndefined(action.payload.pagination.sort) && !isString(action.payload.pagination.sort)) {
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
  validatePagination(action);
  validatePageNumber(action);
  validatePageSize(action);
  validateSort(action);

  const { page, page_size, sort } = action.payload.pagination;

  let newState;
  if (page_size !== state.page_size ||
      sort !== state.sort ||
      !isEqual(state.query, action.payload.query)) {
    log('Resetting pagination state as page_size or sort changed');
    newState = {};
  } else {
    newState = { ...state };
  }
  return {
    ...newState,
    page_size,
    sort,
    query: action.payload.query,
    [page]: {
      ids: state[page] ? state[page].ids : [],
      isFetching: true,
      error: undefined,
    },
  };
}

function handleSuccessAction(state, action) {
  validatePageNumber(action);
  validateCount(action);
  validateResult(action);

  return {
    ...state,
    nextUrl: action.payload.nextUrl,
    previousUrl: action.payload.previousUrl,
    count: action.payload.count,
    [action.payload.pagination.page]: {
      isFetching: false,
      error: undefined,
      ids: action.payload.result,
    },
  };
}

function handleFailureAction(state, action) {
  validatePageNumber(action);
  validateError(action);
  const { page } = action.payload.pagination;
  return {
    ...state,
    [page]: {
      isFetching: false,
      error: action.payload.error,
    },
  };
}

export default function paginate({ actionTypes }) {
  const [startType, successType, failureType] = actionTypes;

  return function paginatedReducer(state = {}, action) {
    switch (action.type) {
      case startType:
        return handleStartAction(state, action);
      case successType:
        return handleSuccessAction(state, action);
      case failureType:
        return handleFailureAction(state, action);
      default:
        return state;
    }
  };
}

export function getPagination(state, selector) {
  const keys = ['nextUrl', 'previousUrl', 'count', 'page_size', 'sort'];
  return pick(get(state.paginated, selector), keys);
}

export function getPageState(state, page, selector) {
  return pick(get(state.paginated, `${selector}.${page}`), ['isFetching', 'error']);
}
