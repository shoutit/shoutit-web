import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DocumentTitle from 'react-document-title';

import Header from '../header/header.jsx';

/**
 * Wrap a child in a layout with optional header. Set `fixedHeight` to `true`
 * to have the child wrapped into a node having the same hight as the viewport.
 */
export default class Page extends React.Component {

  static propTypes = {
    fixedHeight: PropTypes.bool,
    flux: PropTypes.object.isRequired,
    title: PropTypes.string,
    header: PropTypes.bool
  }

  static defaultProps = {
    title: 'Shoutit',
    header: true,
    fixedHeight: false
  }

  constructor(props) {
    super(props);
    this.setContentHeight = this.setContentHeight.bind(this);
  }

  state = {
    windowHeight: 0,
    headerHeight: 0
  }

  componentDidMount() {
    const { fixedHeight } = this.props;

    if (fixedHeight) {
      this.setContentHeight();
      this.addResizeEventListener();
    }

  }

  componentDidUpdate(prevProps) {
    const { fixedHeight } = this.props;

    if (fixedHeight !== prevProps.fixedHeight) {
      fixedHeight ? this.addResizeEventListener() : this.removeResizeEventListener();
    }
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
    const windowHeight = window.innerHeight
    let headerHeight = 0;
    const headerNode = ReactDOM.findDOMNode(this.header);
    if (headerNode) {
      headerHeight = headerNode.offsetHeight;
    }
    this.setState({ windowHeight, headerHeight })
  }

  render() {
    const { headerHeight, windowHeight } = this.state;
    const { flux, children, fixedHeight, title, header } = this.props;

    let className = 'Page', wrapperStyle = {};

    if (fixedHeight) {
      className += ' hasFixedHeight'
      wrapperStyle = {
        ...wrapperStyle,
        height: `${windowHeight-headerHeight}px`,
        top: `${headerHeight}px`
      }
    }

    return (
      <DocumentTitle title={ title }>
        <div className={ className }>
          { header && <Header ref={ c => this.header = c } flux={ flux } /> }
          <div className="Page-wrapper" style={ wrapperStyle }>
            <div className="Page-content">
              { children }
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

}
