import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./List.scss');
}

export default class List extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
    title: PropTypes.node,
  }
  render() {
    return (
      <section className="List">
        { this.props.title && <h3>{ this.props.title }</h3> }
        <ul>
          { this.props.children.map((child, i) =>
            <li key={ i }>{ child }</li>
          ) }
        </ul>
      </section>
    );
  }
}
