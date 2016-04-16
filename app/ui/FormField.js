import React, { PropTypes, Component } from 'react';
import Tooltip from '../ui/Tooltip';

import { getErrorsByLocation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./FormField.scss');
}

function ValidationError({ errors }) {
  return (
    <div className="FormField-error-overlay">
      { errors && errors.map((error, i) => <div key={ i }>{ error.message }</div>) }
    </div>
  );
}

ValidationError.propTypes = {
  errors: PropTypes.array.isRequired,
};

export default class FormField extends Component {

  static propTypes = {
    field: PropTypes.element,
    children: PropTypes.node,
    name: PropTypes.string.isRequired,

    block: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.object,
    initialValue: PropTypes.string,
    label: PropTypes.string,
    inputRef: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    startElement: PropTypes.element,
    tooltipPlacement: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    tooltipPlacement: 'right',
    block: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || props.value || '',
      error: props.error,
    };
  }

  state = {
    value: '',
    focus: false,
    error: null,
  };

  componentDidMount() {
    // Detect if autofill has put some value in the field
    if (this.field && this.getValue() && !this.state.value) {
      this.setState({ value: this.getValue() }); // eslint-disable-line
    }
  }

  componentWillReceiveProps(nextProps) {
    let state;
    if (nextProps.value !== this.props.value) {
      state = { ...state, value: nextProps.value };
    }
    if (nextProps.error !== this.props.error) {
      state = { ...state, error: nextProps.error };
    }
    if (state) {
      this.setState(state);
    }
  }

  getValue() {
    return this.field.value;
  }

  getValidationErrors() {
    if (!this.state.error) {
      return [];
    }
    return getErrorsByLocation(this.state.error, this.props.name);
  }

  field = null;

  handleChange(e) {
    const value = this.field.value;
    this.setState({ value, error: null });
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
      this.props.onBlur(e);
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
    const { block, startElement, disabled, label, className, placeholder, tooltipPlacement, field, inputRef, children, style, ...props } = this.props;
    const { value, focus, error } = this.state;
    const validationErrors = this.getValidationErrors();
    let cssClass = 'FormField';
    if (block) {
      cssClass += ' block';
    }
    if (validationErrors.length > 0) {
      cssClass += ' has-error';
    }
    if (value) {
      cssClass += ' has-value';
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
      fieldElement = React.cloneElement(field, {
        ...props,
        autoFocus: !!error,
        ref: el => {
          this.field = el;
          if (inputRef) {
            inputRef(this);
          }
        },
        id: this._reactInternalInstance._rootNodeID,
        placeholder,
        disabled,
        className: 'FormField-input',
        onChange: e => this.handleChange(e),
        onFocus: e => this.handleFocus(e),
        onBlur: e => this.handleBlur(e),
      });
    }

    let content = (
      <span className="field-wrapper">
        { startElement && <span className="FormField-start-element"> { startElement }</span> }
        <span className="field-element-wrapper">
          { fieldElement || children }
        </span>
      </span>
    );


    return (
      <span className={ cssClass } style={ style }>
        { label && <label htmlFor={this._reactInternalInstance._rootNodeID}>{ label }</label> }
        <Tooltip
          destroyTooltipOnHide
          white
          visible={ validationErrors.length > 0 }
          placement={ tooltipPlacement }
          overlay={ <ValidationError errors={ validationErrors } /> }>
          { content }
        </Tooltip>
      </span>
    );
  }
}
