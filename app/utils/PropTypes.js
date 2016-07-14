import { PropTypes } from 'react';

export const PaginationPropTypes = {
  count: PropTypes.number.isRequired,
  isFetching: PropTypes.bool,
  nextUrl: PropTypes.string,
  previousUrl: PropTypes.string,
};
