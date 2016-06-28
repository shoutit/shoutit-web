import React, { Component, PropTypes } from 'react';
import './TagIcon.scss';

class TagIcon extends Component {

  static propTypes = {
    tag: PropTypes.object.isRequired,
  }
  render() {
    const style = {
      backgroundImage: `url("${this.props.tag.icon}")`,
    };
    return <span className="TagIcon" style={ style } />;
  }
}

export default TagIcon;
