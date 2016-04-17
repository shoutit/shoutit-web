import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

export default class TextField extends Component {
  getValue() {
    return this.refs.field.getValue();
  }
  focus() {
    this.refs.field.focus();
  }
  blur() {
    this.refs.field.blur();
  }
  select() {
    this.refs.field.select();
  }
  render() {
    return <FormField { ...this.props } type={ this.props.type || 'text' } field="input" ref="field" />;
  }
}

TextField.propTypes = {
  type: PropTypes.string,
};
