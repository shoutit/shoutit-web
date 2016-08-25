import React, { Component, PropTypes } from 'react';

import './List.scss';

export default class List extends Component {
  static propTypes = {
    children: PropTypes.array,
    title: PropTypes.node,
  }
  render() {
    return (
      <div className="List">
        { this.props.title && <h3>{ this.props.title }</h3> }
        { this.props.children &&
          <ul>
            { this.props.children.map((child, i) =>
              <li key={ i }>{ child }</li>
            ) }
          </ul>
        }
      </div>
    );
  }
}
