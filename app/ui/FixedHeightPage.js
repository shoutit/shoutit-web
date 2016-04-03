/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.BROWSER) {
  require('./FixedHeightPage.scss');
}

/**
 * Wrap a child in a layout with optional header. Set `fixedHeight` to `true`
 * to have the child wrapped into a node having the same hight as the viewport.
 */
export default class FixedHeightPage extends React.Component {

  constructor(props) {
    super(props);
    this.setContentHeight = this.setContentHeight.bind(this);
  }

  state = {
    height: 0,
  }

  componentDidMount() {
    this.setContentHeight();
    this.addResizeEventListener();
  }

  componentWillReceiveProps() {
    this.setContentHeight();
  }

  componentWillUnmount() {
    this.removeResizeEventListener();
  }

  addResizeEventListener() {
    window.addEventListener('resize', this.setContentHeight);
  }

  removeResizeEventListener() {
    window.removeEventListener('resize', this.setContentHeight);
  }

  setContentHeight() {
    const windowHeight = window.innerHeight;
    const { top } = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.setState({ height: windowHeight - top });
  }

  render() {
    const { height } = this.state;
    const { children } = this.props;

    return (
      <div className="FixedHeightPage" style={ { height: `${height}px` } }>
        <div className="FixedHeightPage-wrapper">
          { children }
        </div>
      </div>
    );
  }

}
