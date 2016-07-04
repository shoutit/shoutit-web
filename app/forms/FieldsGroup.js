import React, { Component, PropTypes } from 'react';
import './FieldsGroup.scss';

class FieldsGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  render() {
    return (
      <div className="FieldsGroup">
        { this.props.children }
      </div>
    );
  }
}

export default FieldsGroup;
