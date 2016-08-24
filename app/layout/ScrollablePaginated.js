import React, { Component } from 'react';
import debug from 'debug';
import classNames from 'classnames';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import Progress from '../widgets/Progress';
import Scrollable from '../layout/Scrollable';

const log = debug('shoutit:widgets:ScrollablePaginated');

/**
 * Render a Scrollable that can load paginated data when it's scrolled
 * to the bottom.
 *
 * @export
 * @class ScrollablePaginated
 * @extends {Component}
 */
export default class ScrollablePaginated extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    showProgress: PropTypes.bool,
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
      log('Will refresh using the current page size');
      delete params.endpoint;
      params.query = {
        page_size: this.props.ids.length,
      };
    }
    this.loadData(params);
  }

  componentDidUpdate(prevProps) {
    if (this.props.nextUrl !== prevProps.nextUrl) {
      this.loadDataIfNeeded();
    }
  }

  getLoadParams() {
    return {
      endpoint: this.props.nextUrl,
    };
  }

  scrollable = null

  loadData(params) {
    log('Loading data with params', params);
    this.props.loadData(params);
  }

  loadDataIfNeeded() {
    log('Loading data if needed...');
    if (this.props.isFetching) {
      log('Will not load data since already fetching');
      return;
    }
    if (!this.props.nextUrl) {
      log('Will not load data since there\'s no next url');
      return;
    }
    if (this.scrollable.canScroll()) {
      log('Will not load data since there\'s still space to scroll');
      return;
    }
    this.loadData(this.getLoadParams());
  }

  handleScrollBottom() {
    if (this.props.nextUrl) {
      log('Scrolled to bottom, will load new data');
      this.loadData(this.getLoadParams());
    }
  }

  render() {
    return (
      <Scrollable
        ref={ el => this.scrollable = el }
        style={ this.props.style }
        className={ classNames('ScrollablePaginated', this.props.className) }
        onScrollBottom={ this.handleScrollBottom }>
        <div className="ScrollablePaginated-Content">
          { this.props.children }
        </div>
        <Progress animate={ this.props.showProgress } />
      </Scrollable>
    );
  }
}
