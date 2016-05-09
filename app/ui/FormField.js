import React, { PropTypes, Component } from 'react';

import { getErrorsByLocation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./FormField.scss');
}

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
    block: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.object,
    field: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputRef: PropTypes.func,
    label: PropTypes.string,
    maxLength: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    startElement: PropTypes.element,
    style: PropTypes.object,
    tooltipPlacement: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    tooltipPlacement: 'right',
    block: false,
    inset: false,
  }

  constructor(props) {
    super(props);
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

  setValue(value) {
    this.setState({ value });
  }

  getValidationErrors() {
    if (!this.state.error) {
      return [];
    }
    return getErrorsByLocation(this.state.error, this.props.name);
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
    const { block, startElement, disabled, label, className, placeholder, field, inputRef, children, style, ancillary, ...props } = this.props;
    const { focus, value } = this.state;
    const validationErrors = this.getValidationErrors() || [];
    let cssClass = 'FormField';
    if (block) {
      cssClass += ' block';
    }
    if (validationErrors.length > 0) {
      cssClass += ' has-error';
    }
    if (focus) {
      cssClass += ' has-focus';
    }
    if (disabled) {
      cssClass += ' disabled';
    }
    if (!label) {
      cssClass += ' no-label';
    }
    if (className) {
      cssClass += ` ${className}`;
    }

    let fieldElement;
    if (field) {
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
        id: props.name,
        className: 'FormField-input',
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
      });
    }

    return (
      <span className={ cssClass } style={ style }>
        { label &&
          <label htmlFor={ props.name }>
            <span className="FormField-label">{ label }</span>
            { props.maxLength && <span className="FormField-max-length">{ `${value.length}/${props.maxLength}` }</span> }
          </label>
        }
        <span className="field-wrapper">
          { startElement && <span className="FormField-start-element"> { startElement }</span> }
          <span className="field-element-wrapper">
            { fieldElement || children }
          </span>
        </span>
        { validationErrors.length === 0 && ancillary && <span className="FormField-ancillary">
          { ancillary }
        </span>
        }
        { validationErrors.length > 0 &&
          <ValidationError errors={ validationErrors } />
        }
      </span>
    );
  }
}
