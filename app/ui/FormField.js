import React, { PropTypes, Component } from 'react';
import Tooltip from '../ui/Tooltip';

if (process.env.BROWSER) {
  require('./FormField.scss');
}

export default class FormField extends Component {

  static propTypes = {
    field: PropTypes.element,
    children: PropTypes.node,

    block: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.array,
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
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || props.value || '',
    };
  }

  state = {
    value: '',
    focus: false,
  };

  componentDidMount() {
    // Detect if autofill has put some value in the field
    if (this.field && this.getValue() && !this.state.value) {
      this.setState({ value: this.getValue() }); // eslint-disable-line
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getValue() {
    return this.field.value;
  }

  field = null;

  handleChange(e) {
    const value = this.field.value;
    if (this.props.onChange) {
      this.props.onChange(value, e);
    }
    this.setState({ value });
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
    const { block = false, startElement, disabled, label, className, placeholder, errors, tooltipPlacement = 'right', field, inputRef, children, ...props } = this.props;
    const { value, focus } = this.state;
    let cssClass = 'FormField';
    const hasError = errors && errors.length > 0;
    if (block) {
      cssClass += ' block';
    }
    if (hasError) {
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
    if (errors && errors.length > 0) {
      cssClass += ' has-error';
    }

    let fieldElement;
    if (field) {
      fieldElement = React.cloneElement(field, {
        ...props,
        autoFocus: errors && errors.length > 0,
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

    return (
      <span className={ cssClass }>
        { label && <label htmlFor={this._reactInternalInstance._rootNodeID}>{ label }</label> }
        <Tooltip
          destroyTooltipOnHide
          white
          visible={ hasError }
          placement={ tooltipPlacement }
          overlay={
            <div className="FormField-error-overlay">
              { errors && errors.map((error, i) => <div key={ i }>{ error.message }</div>) }
            </div>
          }>
          <span className="field-wrapper">
            { startElement && <span className="FormField-start-element"> { startElement }</span> }
            <span className="field-element-wrapper">
              { fieldElement || children }
            </span>
          </span>
        </Tooltip>
      </span>
    );
  }
}
