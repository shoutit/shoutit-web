import React, { PropTypes, Component } from 'react';
import Button from '../ui/Button';

if (process.env.BROWSER) {
  require('./UploadButton.scss');
}
export default class UploadButton extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    accept: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  }

  render() {
    const { accept, children, name, onChange, ...props } = this.props;
    return (
      <span className="UploadButton">
        <input id={ name } type="file" accept={ accept } onChange={ onChange } />
        <Button {...props} element="label" htmlFor={ name }>
          { children }
        </Button>
      </span>
    );
  }
}
