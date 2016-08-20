import React, { PropTypes, Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import FormField from './FormField';

export default class TextArea extends Component {
  static propTypes = {
    autosize: PropTypes.bool,
  }
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
    const { autosize, ...props } = this.props;
    return <FormField { ...props } field={ autosize ? TextareaAutosize : 'textarea' } ref="field" />;
  }
}
