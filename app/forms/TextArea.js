import React, { PropTypes, Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import FormField from './FormField';

export default class TextArea extends Component {
  static propTypes = {
    autosize: PropTypes.bool,
  }
  getValue() {
    return this.field.getValue();
  }
  field = null
  focus() {
    this.field.focus();
  }
  blur() {
    this.field.blur();
  }
  select() {
    this.field.select();
  }
  render() {
    const { autosize, ...props } = this.props;
    return (
      <FormField
        { ...props }
        field={ autosize ? TextareaAutosize : 'textarea' }
        ref={ el => { this.field = el; } }
      />
    );
  }
}
