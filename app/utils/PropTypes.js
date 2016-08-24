import { PropTypes } from 'react';

export const PaginationPropTypes = {
  count: PropTypes.number,
  ids: PropTypes.array,
  isFetching: PropTypes.bool,
  nextUrl: PropTypes.string,
  previousUrl: PropTypes.string,
};

export default PropTypes;
