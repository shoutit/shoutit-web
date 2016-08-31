import React, { PropTypes, Component } from 'react';
import colors from '../constants/colors';

import './SimpleIcon.scss';

class SimpleIcon extends Component {
  static propTypes = {
    colorName: PropTypes.oneOf(Object.keys(colors)),

    size: PropTypes.oneOf(['small', 'medium', 'large', 'huge']),
    name: PropTypes.oneOf(['search', 'chevron', 'close']),
    rotate: PropTypes.oneOf(['up', 'down', 'right', 'left']),

    hover: PropTypes.bool,
  }
  static defaultProps = {
    colorName: 'COLOR_TEXT',
    hover: false,
    rotation: 'left',
  }
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = {
      hover: false,
    };
  }
  getIcon(name) {
    switch (name) {
      case 'close':
        return <polygon points="8 33.5168919 19.5168919 22 8 10.4594595 10.4831081 8 22 19.5168919 33.5405405 8 36 10.4594595 24.4831081 22 36 33.5168919 33.5405405 36 22 24.4831081 10.4831081 36" />;
      case 'chevron':
        return <path d="M29.3964826,18.7208543 L18.1020879,8.68175579 C17.1630509,7.77274807 15.641715,7.77274807 14.7042777,8.68175579 C13.7652408,9.5907635 13.7652408,11.0634489 14.7042777,11.9709081 L25.9986725,22.0045016 L14.7042777,32.0290919 C13.7652408,32.9380997 13.7652408,34.4107851 14.7042777,35.3182442 C15.6433147,36.2272519 17.1646506,36.2272519 18.1020878,35.3182442 L29.3964827,25.2936539 C30.3339199,24.3877433 30.8026385,23.1953482 30.8026385,22.0045016 C30.8026385,20.8136551 30.3339199,19.6267649 29.3964826,18.7208543 L29.3964826,18.7208543 Z" />;
      case 'info':
        return <path d="M26.6666667,30.75 C26.6666667,31.078125 26.4114583,31.3333333 26.0833333,31.3333333 L17.9166667,31.3333333 C17.5885417,31.3333333 17.3333333,31.078125 17.3333333,30.75 L17.3333333,27.8333333 C17.3333333,27.5052083 17.5885417,27.25 17.9166667,27.25 L19.6666667,27.25 L19.6666667,21.4166667 L17.9166667,21.4166667 C17.5885417,21.4166667 17.3333333,21.1614583 17.3333333,20.8333333 L17.3333333,17.9166667 C17.3333333,17.5885417 17.5885417,17.3333333 17.9166667,17.3333333 L23.75,17.3333333 C24.078125,17.3333333 24.3333333,17.5885417 24.3333333,17.9166667 L24.3333333,27.25 L26.0833333,27.25 C26.4114583,27.25 26.6666667,27.5052083 26.6666667,27.8333333 L26.6666667,30.75 Z M24.3333333,14.4166667 C24.3333333,14.7447917 24.078125,15 23.75,15 L20.25,15 C19.921875,15 19.6666667,14.7447917 19.6666667,14.4166667 L19.6666667,11.5 C19.6666667,11.171875 19.921875,10.9166667 20.25,10.9166667 L23.75,10.9166667 C24.078125,10.9166667 24.3333333,11.171875 24.3333333,11.5 L24.3333333,14.4166667 Z M36,22 C36,14.2708333 29.7291667,8 22,8 C14.2708333,8 8,14.2708333 8,22 C8,29.7291667 14.2708333,36 22,36 C29.7291667,36 36,29.7291667 36,22 L36,22 Z" />;
      case 'search':
        return <path d="M27.3846154,17.8461538 C27.3846154,22.0024038 24.0024038,25.3846154 19.8461538,25.3846154 C15.6899038,25.3846154 12.3076923,22.0024038 12.3076923,17.8461538 C12.3076923,13.6899038 15.6899038,10.3076923 19.8461538,10.3076923 C24.0024038,10.3076923 27.3846154,13.6899038 27.3846154,17.8461538 L27.3846154,17.8461538 Z M36,31.8461538 C36,31.2740385 35.7644231,30.71875 35.3774038,30.3317308 L29.6057692,24.5600962 C30.96875,22.5913462 31.6923077,20.2355769 31.6923077,17.8461538 C31.6923077,11.3004808 26.3918269,6 19.8461538,6 C13.3004808,6 8,11.3004808 8,17.8461538 C8,24.3918269 13.3004808,29.6923077 19.8461538,29.6923077 C22.2355769,29.6923077 24.5913462,28.96875 26.5600962,27.6057692 L32.3317308,33.3605769 C32.71875,33.7644231 33.2740385,34 33.8461538,34 C35.0240385,34 36,33.0240385 36,31.8461538 L36,31.8461538 Z" />; default:
        return null;
    }
  }
  handleMouseEnter() {
    this.setState({ hover: true });
  }
  handleMouseLeave() {
    this.setState({ hover: false });
  }
  render() {
    let { colorName } = this.props;
    if (this.state.hover && colors[`${colorName}_HOVER`]) {
      colorName = `${colorName}_HOVER`;
    }
    let className = 'SimpleIcon';
    if (this.props.rotate && this.props.rotate !== 'left') {
      className += ` rotate-${this.props.rotate}`;
    }
    let size = 30;
    switch (this.props.size) {
      case 'small':
        size = 16;
        break;
      case 'large':
        size = 48;
        break;
      case 'huge':
        size = 64;
        break;
      default:
        break;
    }
    return (
      <svg
        className={ className }
        onMouseEnter={ this.props.hover && this.handleMouseEnter }
        onMouseLeave={ this.props.hover && this.handleMouseLeave }
        width={ size }
        height={ size }
        viewBox="0 0 44 44"
        version="1.1">
        <g fill={ colors[colorName] }>
          { this.getIcon(this.props.name) }
        </g>
      </svg>
    );
  }
}

export default SimpleIcon;
