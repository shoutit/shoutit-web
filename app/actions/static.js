import * as actionTypes from './actionTypes';
import { STATIC } from '../schemas';

export const loadStatic = id => ({
  types: [
    actionTypes.LOAD_STATIC_START,
    actionTypes.LOAD_STATIC_SUCCESS,
    actionTypes.LOAD_STATIC_FAILURE,
  ],
  service: {
    name: 'static',
    schema: STATIC,
  },
});
