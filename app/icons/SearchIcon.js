import React, { PropTypes, Component } from 'react';
import colors from '../constants/colors';

class SearchIcon extends Component {
  static propTypes = {
    colorName: PropTypes.oneOf(Object.keys(colors)),
  }
  static defaultProps = {
    colorName: 'WHITE',
  }
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = {
      hover: false,
    };
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
    return (
      <svg onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave } width="30px" height="30px" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="icons/search" fill={ colors[colorName] }>
          <path d="M27.3846154,17.8461538 C27.3846154,22.0024038 24.0024038,25.3846154 19.8461538,25.3846154 C15.6899038,25.3846154 12.3076923,22.0024038 12.3076923,17.8461538 C12.3076923,13.6899038 15.6899038,10.3076923 19.8461538,10.3076923 C24.0024038,10.3076923 27.3846154,13.6899038 27.3846154,17.8461538 L27.3846154,17.8461538 Z M36,31.8461538 C36,31.2740385 35.7644231,30.71875 35.3774038,30.3317308 L29.6057692,24.5600962 C30.96875,22.5913462 31.6923077,20.2355769 31.6923077,17.8461538 C31.6923077,11.3004808 26.3918269,6 19.8461538,6 C13.3004808,6 8,11.3004808 8,17.8461538 C8,24.3918269 13.3004808,29.6923077 19.8461538,29.6923077 C22.2355769,29.6923077 24.5913462,28.96875 26.5600962,27.6057692 L32.3317308,33.3605769 C32.71875,33.7644231 33.2740385,34 33.8461538,34 C35.0240385,34 36,33.0240385 36,31.8461538 L36,31.8461538 Z"></path>
        </g>
      </svg>
    );
  }
}

export default SearchIcon;
