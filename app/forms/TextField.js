import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

export default class TextField extends Component {
  static propTypes = {
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setValue(nextProps.value);
    }
  }
  getValue() {
    let fieldValue = this.field.getValue();
    switch (this.props.type) {
      case 'url':
        if (!fieldValue.match(/^https?:\/\//)) {
          fieldValue = `http://${fieldValue}`;
        }
        break;
      default: break;
    }
    return fieldValue;
  }
  setValue(value) {
    this.field.setValue(value);
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
    const { type, ...props } = this.props;
    return (
      <FormField
        { ...props }
        type={ type || 'text' }
        field="input"
        ref={ el => { this.field = el; } }
      />
    );
  }
}
