
import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

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
      schema: Schemas.TAG,
    },
  };
}

export function loadTagShouts(name, searchParams, endpoint) {
  return {
    types: [
      actionTypes.LOAD_TAG_SHOUTS_START,
      actionTypes.LOAD_TAG_SHOUTS_SUCCESS,
      actionTypes.LOAD_TAG_SHOUTS_FAILURE,
    ],
    payload: { name },
    service: {
      name: 'shouts',
      params: { searchParams: { ...searchParams, tags: name }, endpoint },
      schema: Schemas.SHOUTS,
    },
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
      schema: Schemas.TAGS,
    },
  };
}
