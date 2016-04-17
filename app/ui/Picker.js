import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

export default class Picker extends Component {
  getValue() {
    return this.refs.field.getValue();
  }
  focus() {
    this.refs.field.focus();
  }
  blur() {
    this.refs.field.blur();
  }
  render() {
    const { children } = this.props;
    return <FormField { ...this.props } field="select" ref="field">{ children }</FormField>;
  }
}

Picker.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
};
