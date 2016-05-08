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
    field: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    block: PropTypes.bool,
    inset: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.object,
    label: PropTypes.string,
    inputRef: PropTypes.func,
    maxLength: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    startElement: PropTypes.element,
    tooltipPlacement: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    tooltipPlacement: 'right',
    block: false,
    inset: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      focus: false,
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

  getValidationErrors() {
    if (!this.state.error) {
      return [];
    }
    return getErrorsByLocation(this.state.error, this.props.name);
  }

  field = null;

  handleChange(e) {
    this.setState({ error: null });
    if (this.props.onChange) {
      this.props.onChange(this.field.value, e);
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
    const { block, startElement, disabled, label, className, placeholder, tooltipPlacement, field, inputRef, children, style, inset, ...props } = this.props;
    const { focus, error } = this.state;
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
    if (inset) {
      cssClass += ' inset';
    }
    if (className) {
      cssClass += ` ${className}`;
    }

    let fieldElement;
    if (field) {
      fieldElement = React.createElement(field, {
        ...props,
        children,
        autoFocus: !!error,
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
    const value = this.getValue();
    return (
      <span className={ cssClass } style={ style }>
        { label &&
          <label htmlFor={ props.name }>
            <span className="FormField-label">{ label }</span>
            { props.maxLength && <span className="FormField-max-length">{ `${value.length}/${props.maxLength}` }</span> }
          </label>
        }
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
