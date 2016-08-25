import React, { PropTypes, Component } from 'react';
import ReactEmoji from 'react-emoji';

class EmojizeText extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const text = this.props.children;
    return (
      <p>{ ReactEmoji.emojify(text) }</p>
    );
  }
}

export default EmojizeText;
