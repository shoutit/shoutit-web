import set from 'lodash/set';

import * as actionTypes from './actionTypes';
import { TAG, SHOUTS, TAGS } from '../schemas';

export function loadTagIfNeeded(tag, properties = []) {
  if (properties.every(property => tag.hasOwnProperty(property))) {
    return {
      type: null,
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

export function invalidateTagShouts(tag) {
  return {
    type: actionTypes.INVALIDATE_TAG_SHOUTS,
    payload: tag,
  };
}

export function loadRelatedTags(tag, query, endpoint) {
  return {
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
  };
}

export function listenToTag(loggedUser, tag) {
  const entities = {};

  set(entities, `tags.${tag.id}.isListening`, true);
  set(entities, `tags.${tag.id}.listenersCount`, tag.listenersCount + 1);
  set(entities, `users.${loggedUser.id}.listeningCount.tags`, loggedUser.listeningCount.tags + 1);

  return {
    types: [
      actionTypes.LISTEN_TAG_START,
      actionTypes.LISTEN_TAG_SUCCESS,
      actionTypes.LISTEN_TAG_FAILURE,
    ],
    payload: { tag, loggedUser, result: tag.id, entities },
    service: {
      name: 'tagListen',
      method: 'create',
      params: { tag },
      parsePayload: payload => {
        if (payload.error) {
          set(payload, `entities.tags.${tag.id}`, tag);
          set(payload, `entities.users.${loggedUser.id}.listeningCount.tags`, loggedUser.listeningCount.tags);
        }
        return payload;
      },
    },
  };
}


export function stopListeningToTag(loggedUser, tag) {

  const entities = {};

  set(entities, `tags.${tag.id}.isListening`, false);
  set(entities, `tags.${tag.id}.listenersCount`, tag.listenersCount - 1);
  set(entities, `users.${loggedUser.id}.listeningCount.tags`, loggedUser.listeningCount.tags - 1);

  return {
    types: [
      actionTypes.STOP_LISTEN_TAG_START,
      actionTypes.STOP_LISTEN_TAG_SUCCESS,
      actionTypes.STOP_LISTEN_TAG_FAILURE,
    ],
    payload: { tag, loggedUser, result: tag.id, entities },
    service: {
      name: 'tagListen',
      method: 'delete',
      params: { tag },
      parsePayload: payload => {
        if (payload.error) {
          set(payload, `entities.tags.${tag.id}.listenersCount`, tag.listenersCount);
          set(payload, `entities.users.${loggedUser.id}.listeningCount.tags`, loggedUser.listeningCount.tags);
        }
        return payload;
      },
    },
  };
}
