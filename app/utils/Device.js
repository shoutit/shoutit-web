import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { getDevice } from '../reducers/browser';

let Device = ({ children, type, currentType }) => {
  if (type.split().indexOf(currentType) === -1) {
    return null;
  }
  if (React.Children.count(children) > 1 || typeof children === 'string') {
    return <div>{ children }</div>;
  }
  return children;
};

Device.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  currentType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ currentType: getDevice(state) });
export default Device = connect(mapStateToProps)(Device);
