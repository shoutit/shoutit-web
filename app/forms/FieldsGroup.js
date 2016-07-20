import React, { Component, PropTypes } from 'react';

import './FieldsGroup.scss';

class FieldsGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    wrap: PropTypes.bool,
    errorLocation: PropTypes.string,
    error: PropTypes.object,
  }
  render() {
    let className = 'FieldsGroup';
    if (this.props.wrap) {
      className += ' wrap';
    }
    return (
      <div className={ className }>
        { this.props.children }
      </div>
    );
  }
}

export default FieldsGroup;
