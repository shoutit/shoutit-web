import { PropTypes as ReactPropTypes } from 'react';

const PropTypes = {
  ...ReactPropTypes,
  size: ReactPropTypes.oneOf(['small', 'medium', 'large', 'huge']),
};

export default PropTypes;
