import React, { PropTypes, Component } from 'react';

if (process.env.BROWSER) {
  require('./FileInput.scss');
}

export default class FileInput extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    accept: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  }
  render() {
    const { accept, children, name, onChange, className, disabled } = this.props;
    let cssClass = 'FileInput';
    if (className) {
      cssClass += ` ${className}`;
    }
    return (
      <span className={ cssClass }>
        <input id={ name } type="file" accept={ accept } onChange={ onChange } disabled={ disabled } />
        <label htmlFor={ name } zIndex={ 0 }>
          { children }
        </label>
      </span>
    );
  }
}