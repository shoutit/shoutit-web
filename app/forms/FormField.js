import React, { PropTypes, Component } from 'react';

import { getErrorsByLocation } from '../utils/APIUtils';

import AncillaryText from '../widgets/AncillaryText';

import Label from '../forms/Label';
import './FormField.scss';

function ValidationError({ errors }) {
  return (
    <div className="FormField-error">
      { errors && errors.map((error, i) => <div key={ i }>{ error.message }</div>) }
    </div>
  );
}

ValidationError.propTypes = {
  errors: PropTypes.array.isRequired,
};

export default class FormField extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,

    ancillary: PropTypes.node,
    flex: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    flexibleContent: PropTypes.bool,
    error: PropTypes.object,
    errorLocation: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    field: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputRef: PropTypes.func,
    label: PropTypes.string,
    labelTooltip: PropTypes.string,
    maxLength: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    startElement: PropTypes.element,
    endElement: PropTypes.element,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    flex: false,
  }

  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      error: props.error,
      focus: false,
      value: props.value || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    let state;
    if (nextProps.error !== this.props.error) {
      state = { ...state, error: nextProps.error };
    }
    if (state) {
      this.setState(state);
    }
  }

  getValue() {
    if (!this.field) {
      return '';
    }
    return this.field.value;
  }

  getErrorLocation() {
    return this.props.errorLocation || this.props.name;
  }

  setValue(value) {
    this.setState({ value });
  }

  getValidationErrors() {
    if (!this.state.error) {
      return [];
    }
    return getErrorsByLocation(this.state.error, this.getErrorLocation());
  }

  field = null;

  handleChange(e) {
    const value = this.getValue();
    this.setState({ error: null, value });
    if (this.props.onChange) {
      this.props.onChange(value, e);
    }
  }

  handleFocus(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.setState({ focus: true });
  }

  handleBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(this.getValue(), e);
    }
    this.setState({ focus: false });
  }

  focus() {
    this.field.focus();
  }

  select() {
    this.field.select();
  }

  blur() {
    this.field.blur();
  }

  render() {
    const {
      ancillary,
      children,
      className,
      disabled,
      endElement,
      field,
      flex,
      flexibleContent,
      inputRef,
      label,
      labelTooltip,
      placeholder,
      startElement,
      style,
      ...props,
    } = this.props;
    const { focus, value } = this.state;
    const validationErrors = this.getValidationErrors() || [];
    let cssClass = 'FormField';

    if (flex) {
      cssClass += ' flex';
    }
    if (validationErrors.length > 0) {
      cssClass += ' has-error';
    }
    if (focus) {
      cssClass += ' has-focus';
    }
    if (startElement) {
      cssClass += ' has-start';
    }
    if (endElement) {
      cssClass += ' has-end';
    }
    if (flexibleContent) {
      cssClass += ' flexible-content';
    }
    if (disabled) {
      cssClass += ' disabled';
    }
    if (typeof field === 'string') {
      cssClass += ` with-${field}`;
    }
    if (!label) {
      cssClass += ' no-label';
    }
    if (className) {
      cssClass += ` ${className}`;
    }

    let fieldElement;
    if (field) {
      delete props.error;

      fieldElement = React.createElement(field, {
        ...props,
        value,
        children,
        ref: el => {
          this.field = el;
          if (inputRef) {
            inputRef(this);
          }
        },
        placeholder,
        disabled,
        id: props.id || props.name,
        className: 'FormField-input',
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
      });
    }


    return (
      <div className={ cssClass } style={ style }>
        { label &&
          <Label
            tooltip={ labelTooltip }
            htmlFor={ props.id || props.name }
            maxLength={ props.maxLength }
            currentLength={ value.length }>
            { label }
          </Label>
        }
        <div className="FormField-wrapper">
          { startElement &&
            <span className="FormField-start">
              <span>
                { startElement }
              </span>
            </span>
          }
          <div className="FormField-element">
            { fieldElement || children }
          </div>
          { endElement &&
            <span className="FormField-end">
              <span>
                { endElement }
              </span>
            </span>
          }
        </div>
        { validationErrors.length > 0 &&
          <ValidationError errors={ validationErrors } />
        }
        { validationErrors.length === 0 && ancillary &&
          <AncillaryText>
            { ancillary }
          </AncillaryText>
        }
      </div>
    );
  }
}
