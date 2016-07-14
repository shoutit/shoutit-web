import React, { PropTypes, Component } from 'react';
import './AncillaryText.scss';

class AncillaryText extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  render() {
    return (
      <div className="AncillaryText">
        { this.props.children }
      </div>
    );
  }
}

export default AncillaryText;
