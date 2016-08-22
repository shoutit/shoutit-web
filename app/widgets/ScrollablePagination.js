import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import debug from 'debug';

import Scrollable from '../layout/Scrollable';

const log = debug('shoutit:widgets:ScrollablePagination');

export default class ScrollablePagination extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,
    scrollElement: PropTypes.func,
    isFetching: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    endpoint: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
  }

  componentDidMount() {
    log('Loading data after component is mounted', this.props.endpoint || 'No endpoint given');
    this.props.loadData(this.props.endpoint);
  }

  componentDidUpdate(prevProps) {
    if (this.props.endpoint !== prevProps.endpoint) {
      this.loadDataIfNeeded();
    }
  }

  loadDataIfNeeded() {
    const { isFetching, endpoint, loadData } = this.props;
    if (isFetching) {
      return;
    }
    if (this.scrollable.canScroll()) {
      // ignore if user can scroll, which will trigger a new load data
      return;
    }
    log('Loading data after component has been updated', endpoint);
    loadData(this.props.endpoint);
  }

  handleScrollBottom() {
    if (this.props.endpoint) {
      this.props.loadData(this.props.endpoint);
    }
  }

  render() {
    return (
      <Scrollable
        ref={ el => { this.scrollable = el; } }
        className="ScrollablePagination"
        scrollElement={ this.props.scrollElement }
        onScrollBottom={ this.handleScrollBottom }>
          { this.props.children }
      </Scrollable>
    );
  }
}
