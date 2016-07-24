import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

export default class Picker extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setValue(nextProps.value);
    }
  }
  getValue() {
    return this.refs.field.getValue();
  }
  setValue(value) {
    this.refs.field.setValue(value);
  }
  focus() {
    this.refs.field.focus();
  }
  blur() {
    this.refs.field.blur();
  }
  render() {
    return (
      <FormField
        { ...this.props }
        field="select"
        ref="field">
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
