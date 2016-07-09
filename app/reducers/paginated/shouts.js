import * as actionTypes from '../../actions/actionTypes';
import paginate, { getPagination, getPageState } from './paginate';
import { denormalize } from '../../schemas';

export default paginate({
  actionTypes: [
    actionTypes.LOAD_SHOUTS_START,
    actionTypes.LOAD_SHOUTS_SUCCESS,
    actionTypes.LOAD_SHOUTS_FAILURE,
  ],
});

export const getShouts = (state, page) =>
  denormalize(
    state.paginated.shouts[page] ?
    state.paginated.shouts[page].ids :
    [],
    state.entities, 'SHOUTS'
  );

export const getShoutsPagination = (state) => getPagination(state, 'shouts');
export const getShoutsPageState = (state, page) => getPageState(state, page, 'shouts');
