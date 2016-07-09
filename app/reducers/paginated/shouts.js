import * as actionTypes from '../../actions/actionTypes';
import paginate, { getPagination, getPageState, getEntities } from './paginate';

export default paginate({
  actionTypes: [
    actionTypes.LOAD_SHOUTS_START,
    actionTypes.LOAD_SHOUTS_SUCCESS,
    actionTypes.LOAD_SHOUTS_FAILURE,
  ],
});

export const getShouts = (state, page) => getEntities(state, 'shouts', page, 'SHOUTS');
export const getShoutsPagination = state => getPagination(state, 'shouts');
export const getShoutsCount = state => getPagination(state, 'shouts').count;
export const getShoutsPageState = (state, page) => getPageState(state, page, 'shouts');
export const getShoutsQuery = state => state.paginated.shouts.query;
