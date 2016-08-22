/* eslint import/prefer-default-export: 0 */

import { PropTypes } from 'react';

export const PaginationPropTypes = {
  count: PropTypes.number.isRequired,
  isFetching: PropTypes.bool,
  nextUrl: PropTypes.string,
  previousUrl: PropTypes.string,
};
