import React, { PropTypes, Component } from 'react';

if (process.env.BROWSER) {
  require('./FileInput.scss');
}

export default class FileInput extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
  }
  handleClick(e) {
    // prevent missing onchange event, see http://stackoverflow.com/questions/2133807
    this.refs.input.value = null;
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    let cssClass = 'FileInput';
    if (this.props.className) {
      cssClass += ` ${this.props.className}`;
    }
    return (
      <span className={ cssClass }>
        <input
          ref="input"
          id={ name }
          type="file"
          accept={ this.props.accept }
          onClick={ this.handleClick.bind(this) }
          onChange={ this.props.onChange }
          disabled={ this.props.disabled }
          multiple={ this.props.multiple }
        />
        <label htmlFor={ name } zIndex={ 0 }>
          { this.props.children }
        </label>
      </span>
    );
  }
}
