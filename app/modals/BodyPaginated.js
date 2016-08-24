import React, { Component } from 'react';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import ScrollablePaginated from '../layout/ScrollablePaginated';

/**
 * Render a modal's body that can load paginated data when it's scrolled
 * to the bottom. Works like ScrollablePaginated, but for modals.
 *
 * @export
 * @class BodyPaginated
 * @extends {Component}
 */
export default class BodyPaginated extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    showProgress: PropTypes.bool,
    pagination: PropTypes.shape(PaginationPropTypes).isRequired,
    loadData: PropTypes.func.isRequired,
  };
  render() {
    return (
      <ScrollablePaginated
        { ...this.props.pagination }
        showProgress={ this.props.showProgress }
        className="ModalBody paginated"
        style={ this.props.style }
        loadData={ this.props.loadData }>
        { this.props.children }
      </ScrollablePaginated>
    );

  }
}
