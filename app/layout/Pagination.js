import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getPath, getQueryAsString, getQuery } from '../reducers/routing';

import Pager from '../widgets/Pager';
import './Pagination.scss';

export function getPageNumbers({ count, pageSize }) {
  if (count <= pageSize) {
    return 0;
  }
  return Math.ceil(count / pageSize);
}

class Pagination extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    page: PropTypes.number,
    count: PropTypes.number,
    querystring: PropTypes.string,
    path: PropTypes.string,
  }
  static defaultProps = {
    pageSize: 9,
    page: 1,
    routed: false,
  }
  render() {
    const { count, pageSize } = this.props;
    const total = getPageNumbers({ count, pageSize });
    if (total === 0) {
      return null;
    }
    let url = this.props.path;
    if (this.props.querystring) {
      url += `?${this.props.querystring}`;
    }
    return (
      <div className="Pagination">
        <Pager
          url={ url }
          previousLabel={ <FormattedMessage id="layout.Pagination.previousLabel" defaultMessage="Previous" /> }
          nextLabel={ <FormattedMessage id="layout.Pagination.nextLabel" defaultMessage="Next" /> }
          total={ total }
          current={ parseInt(this.props.page, 10) }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  path: getPath(state),
  querystring: getQueryAsString(state, ['page']),
  page: getQuery(state).page || 1,
});

export default connect(mapStateToProps)(Pagination);
