import React, { Component } from 'react';
import debug from 'debug';
import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import Scrollable from '../layout/Scrollable';

const log = debug('shoutit:widgets:ScrollablePagination');

export default class ScrollablePagination extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,
    scrollElement: PropTypes.func,
    children: PropTypes.node.isRequired,
    ...PaginationPropTypes,
  }

  constructor(props) {
    super(props);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
  }

  componentDidMount() {
    const params = this.getLoadParams();
    log('Loading data after component is mounted...');
    if (this.props.ids) {
      delete params.endpoint;
      log('Will refresh the current page size');
      params.query = {
        page_size: this.props.ids.length,
      };
    }
    this.loadData(params);
  }

  componentDidUpdate(prevProps) {
    if (this.props.nextUrl !== prevProps.nextUrl) {
      // this.loadDataIfNeeded();
    }
  }

  getLoadParams() {
    return {
      endpoint: this.props.nextUrl,
    };
  }

  loadData(params) {
    log('Loading data with params', params);
    this.props.loadData(params);
  }

  loadDataIfNeeded() {
    log('Loading data if needed...');
    if (this.props.isFetching) {
      log('Will not load since already fetching');
      return;
    }
    if (!this.props.nextUrl) {
      log('Will not load since there\'s no next url');
      return;
    }
    if (this.scrollable.canScroll()) {
      log('Will not load since there\'s space to scroll');
      return;
    }
    this.loadData(this.getLoadParams());
  }

  handleScrollBottom() {
    log('Scrolled to bottom');
    if (this.props.nextUrl) {
      this.loadData(this.getLoadParams());
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
