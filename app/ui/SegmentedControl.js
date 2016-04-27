import React, { PropTypes, Component } from 'react';
import FormField from './FormField';

if (process.env.BROWSER) {
  require('./SegmentedControl.scss');
}

export default class SegmentedControl extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: this.props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    let state;
    if (nextProps.value !== this.props.value) {
      state = { ...state, value: nextProps.value };
    }
    if (state) {
      this.setState(state);
    }
  }
  getValue() {
    return this.state.value;
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e.target.value, e);
    }
  }
  render() {

    const { options, name } = this.props;
    const { value } = this.state;
    const fields = options.map((option, i) => {
      const id = `${name}.${i}`;
      return (
        <span key={ i } className="SegmentedControl-option">
          <input onChange={ this.handleChange } checked={ value === option.value } id={ id } name={ name } type="radio" value={ option.value } />
          <label htmlFor={ id }>{ option.label }</label>
        </span>
      );
    });

    return (
      <FormField className="SegmentedControl" { ...this.props } ref="field">
        <div className="SegmentedControl-options">
          { fields }
        </div>
      </FormField>
    );
  }
}
