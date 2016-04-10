/* eslint-env browser */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

if (process.env.BROWSER) {
  require('./FixedHeightPage.scss');
}
export default class FixedHeightPage extends Component {
  static propTypes = {
    children: PropTypes.Element,
  };
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
  setContentHeight() {
    const windowHeight = window.innerHeight;
    const { top } = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.setState({ height: windowHeight - top });
  }
  addResizeEventListener() {
    window.addEventListener('resize', this.setContentHeight);
  }
  removeResizeEventListener() {
    window.removeEventListener('resize', this.setContentHeight);
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
