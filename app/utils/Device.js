import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { getDevice, getOperatingSystem } from '../reducers/browser';

let Device = ({
  children,
  type,
  currentType,
  operatingSystem,
  currentOperatingSystem,
}) => {
  if (type && type.split(',').indexOf(currentType) === -1) {
    return null;
  }
  if (operatingSystem && operatingSystem.split(',').indexOf(currentOperatingSystem) === -1) {
    return null;
  }
  if (React.Children.count(children) > 1 || typeof children === 'string') {
    return <div>{ children }</div>;
  }
  return children;
};

Device.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  currentType: PropTypes.string,
  operatingSystem: PropTypes.string,
  currentOperatingSystem: PropTypes.string,
};

const mapStateToProps = state => ({
  currentType: getDevice(state),
  currentOperatingSystem: getOperatingSystem(state),
});

export default Device = connect(mapStateToProps)(Device);
