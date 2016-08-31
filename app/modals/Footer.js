import React, { PureComponent, PropTypes } from 'react';
import Progress from '../widgets/Progress';

export default class Footer extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    showProgress: PropTypes.bool,
  };

  static defaultProps = {
    showProgress: false,
  }

  getHeight() {
    return this.node.offsetHeight;
  }

  node = null

  render() {
    return (
      <div className="ModalFooter" ref={ el => { this.node = el; } }>
        { this.props.showProgress ?
          <Progress animate /> :
          this.props.children
        }
      </div>
    );
  }
}
