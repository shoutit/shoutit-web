import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

export default class TextArea extends Component {
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
    return <FormField { ...this.props } field="textarea" ref="field" />;
  }
}

TextArea.propTypes = {
  type: PropTypes.string,
};
