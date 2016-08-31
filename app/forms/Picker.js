import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

export default class Picker extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setValue(nextProps.value);
    }
  }
  getValue() {
    return this.field.getValue();
  }
  setValue(value) {
    this.field.setValue(value);
  }
  focus() {
    this.field.focus();
  }
  blur() {
    this.field.blur();
  }
  render() {
    return (
      <FormField
        { ...this.props }
        field="select"
        ref={ el => { this.field = el; } }>
        { this.props.children }
      </FormField>
    );
  }
}

Picker.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
};
