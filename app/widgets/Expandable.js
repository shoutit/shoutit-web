import React, { PropTypes, Component } from 'react';
import SimpleIcon from '../icons/SimpleIcon';

import './Expandable.scss';

class Expandable extends Component {
  static propTypes = {
    expand: PropTypes.bool,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
  }
  static defaultProps = {
    expand: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expand,
    };
    this.handleLabelClick = this.handleLabelClick.bind(this);
  }
  handleLabelClick() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    let className = 'Expandable';
    if (this.state.expanded) {
      className += ' expanded';
    }
    return (
      <div className={ className }>
        <div className="Expandable-label">
          <span onClick={ this.handleLabelClick }>
            <span>
              { this.props.label }
            </span>
            <SimpleIcon
              size="small"
              name="chevron"
              rotate={ this.state.expanded ? 'down' : 'left' }
            />
          </span>
        </div>
        <div className="Expandable-content">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Expandable;
