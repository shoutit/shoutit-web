import * as actionTypes from './actionTypes';
import { STATIC } from '../schemas';

export const loadStaticPages = id => ({
  types: [
    actionTypes.LOAD_STATIC_PAGES_START,
    actionTypes.LOAD_STATIC_PAGES_SUCCESS,
    actionTypes.LOAD_STATIC_PAGES_FAILURE,
  ],
  service: {
    name: 'staticPages',
  },
});
