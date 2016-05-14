import * as actionTypes from './actionTypes';
import { TAG, SHOUTS, TAGS, PROFILES } from '../schemas';

export function loadTagIfNeeded(tag, properties = []) {
  if (properties.every(property => tag.hasOwnProperty(property))) {
    return {
      type: 'NOOP',
    };
  }
  const { name } = tag;
  return {
    types: [
      actionTypes.LOAD_TAG_START,
      actionTypes.LOAD_TAG_SUCCESS,
      actionTypes.LOAD_TAG_FAILURE,
    ],
    service: {
      name: 'tag',
      params: { name },
      schema: TAG,
    },
  };
}

export function loadTagShouts(name, location, endpoint) {
  return {
    types: [
      actionTypes.LOAD_TAG_SHOUTS_START,
      actionTypes.LOAD_TAG_SHOUTS_SUCCESS,
      actionTypes.LOAD_TAG_SHOUTS_FAILURE,
    ],
    payload: { name },
    service: {
      name: 'shouts',
      params: { searchParams: { country: location.country, tags: name }, endpoint },
      schema: SHOUTS,
    },
  };
}

export const invalidateTagShouts = (tag) => ({
  type: actionTypes.INVALIDATE_TAG_SHOUTS,
  payload: tag,
});

export const loadRelatedTags = (tag, query, endpoint) => ({
  types: [
    actionTypes.LOAD_RELATED_TAGS_START,
    actionTypes.LOAD_RELATED_TAGS_SUCCESS,
    actionTypes.LOAD_RELATED_TAGS_FAILURE,
  ],
  payload: { tag },
  service: {
    name: 'relatedTags',
    params: { tag, endpoint, query },
    schema: TAGS,
  },
});

export const loadTagListeners = (tag, endpoint) => ({
  types: [
    actionTypes.LOAD_TAG_LISTENERS_START,
    actionTypes.LOAD_TAG_LISTENERS_SUCCESS,
    actionTypes.LOAD_TAG_LISTENERS_FAILURE,
  ],
  payload: { tag },
  service: {
    name: 'tagListeners',
    params: { name: tag.name, endpoint },
    schema: PROFILES,
  },
});

export const listenToTag = (loggedUser, tag) => ({
  types: [
    actionTypes.LISTEN_TAG_START,
    actionTypes.LISTEN_TAG_SUCCESS,
    actionTypes.LISTEN_TAG_FAILURE,
  ],
  payload: { tag, loggedUser, result: tag.id },
  service: {
    name: 'tagListen',
    method: 'create',
    params: { tag },
  },
});


export const stopListeningToTag = (loggedUser, tag) => ({
  types: [
    actionTypes.STOP_LISTEN_TAG_START,
    actionTypes.STOP_LISTEN_TAG_SUCCESS,
    actionTypes.STOP_LISTEN_TAG_FAILURE,
  ],
  payload: { tag, loggedUser, result: tag.id },
  service: {
    name: 'tagListen',
    method: 'delete',
    params: { tag },
  },
});
