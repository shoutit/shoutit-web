import React, { PropTypes, Component } from 'react';
import FileInput from '../forms/FileInput';
import Button from '../forms/Button';

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
      <FileInput className="UploadButton" accept={ accept } name={ name } onChange={ onChange }>
        <Button { ...props } element="span">
          { children }
        </Button>
      </FileInput>
    );
  }
}
