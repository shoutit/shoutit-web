import React, { PropTypes, Component } from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import uuid from 'uuid';

if (process.env.BROWSER) {
  require('./Dropdown.scss');
}
export MenuItem from 'react-bootstrap/lib/MenuItem';
export default class DropDown extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['small']),
    toggle: PropTypes.node.isRequired,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }

  render() {
    const { size, toggle, children, ...props } = this.props;
    let cssClass = 'Dropdown';
    if (size) {
      cssClass += ` size-${size}`;
    }
    return (
      <span className={ cssClass }>
        <Dropdown id={ uuid.v1() } { ...props }>
          <Dropdown.Toggle useAnchor disabled={ props.disabled } noCaret >
            { toggle }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            { children }
          </Dropdown.Menu>
        </Dropdown>
      </span>
    );
  }

}
