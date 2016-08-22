import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import './FileInput.scss';

export default class FileInput extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    name: PropTypes.string,
    accept: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
  }

  handleClick(e) {
    // prevent missing onchange event, see http://stackoverflow.com/questions/2133807
    e.target.value = null;
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    const className = classNames('FileInput', this.props.className);
    return (
      <span className={ className }>
        <input
          id={ this.props.id || this.props.name }
          type="file"
          accept={ this.props.accept }
          onClick={ this.handleClick.bind(this) }
          onChange={ this.props.onChange }
          disabled={ this.props.disabled }
          multiple={ this.props.multiple }
          name={ this.props.name }
        />
        <label htmlFor={ this.props.id || this.props.name } zIndex={ 0 }>
          { this.props.children }
        </label>
      </span>
    );
  }
}
