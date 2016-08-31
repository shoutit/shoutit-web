import React, { Component } from 'react';
import debug from 'debug';
import classNames from 'classnames';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import Progress from '../widgets/Progress';
import Scrollable from '../layout/Scrollable';

const log = debug('shoutit:layout:ScrollablePaginated');

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
    children: PropTypes.node,
    className: PropTypes.string,
    showProgress: PropTypes.bool,
    ...PaginationPropTypes,
  }

  constructor(props) {
    super(props);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
  }

  state = {
    triggerOffset: undefined,
  }

  componentDidMount() {
    const params = this.getLoadParams();
    if (params.endpoint !== null) {
      log('Loading data after component is mounted...');
      this.loadData(params);
    } else {
      log('Not loading data after component is mounted since the endpoint is null (hence assuming end of the set)');
    }
    this.setTriggerOffset();
  }

  componentDidUpdate(prevProps) {
    if (this.props.nextUrl !== prevProps.nextUrl) {
      this.loadDataIfNeeded();
    }
    this.setTriggerOffset();
  }

  getLoadParams() {
    return {
      endpoint: this.props.nextUrl,
    };
  }

  // Set the scrollable's offset as one half of the scrollable's height
  setTriggerOffset() {
    const offsetHeight = this.scrollable.getOffsetHeight();
    const triggerOffset = offsetHeight / 2;
    if (triggerOffset !== 0 && triggerOffset !== this.state.triggerOffset) {
      log('Setting triggerOffset to %spx', triggerOffset);
      this.setState({ triggerOffset });
    }

  }

  scrollable = null

  scrollToInitialPosition() {
    this.scrollable.scrollToInitialPosition();
  }

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
        preventDocumentScroll
        ref={ el => this.scrollable = el }
        style={ this.props.style }
        triggerOffset={ this.state.triggerOffset }
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
