import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PaginatedList extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    page: PropTypes.number,
    count: PropTypes.number,
    itemsSelector: PropTypes.func.isRequired,
    paginationSelector: PropTypes.func.isRequired,
  }
  static defaultProps = {
    pageSize: 9,
    page: 0,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.page,
    };
  }
  render() {
    return (
      <div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  items: ownProps.itemsSelector(state, ownProps),
  ...ownProps.paginationSelector(state, ownProps),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: ({ endpoint, page_size, page }) =>
    dispatch(ownProps.fetchData(ownProps, { endpoint, page_size, page })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaginatedList);
