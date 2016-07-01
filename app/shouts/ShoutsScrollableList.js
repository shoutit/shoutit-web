import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { getShoutsByUsername, getPaginationState } from '../reducers/paginated/shoutsByUsername';
import { loadShoutsByUsername } from '../actions/users';

import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';
import ShoutListItem from '../shouts/ShoutListItem';

import './ShoutsScrollableList.scss';

export class ShoutsScrollableList extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    loadData: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    nextUrl: PropTypes.string,
    shouts: PropTypes.arrayOf(PropTypes.object).isRequired,
    onShoutClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.handleScrollBottom = this.handleScrollBottom.bind(this);
  }

  componentDidMount() {
    this.props.loadData();
  }

  componentDidUpdate() {
    this.loadMoreIfNeeded();
  }

  loadMoreIfNeeded() {
    const { loadData, nextUrl, isFetching } = this.props;
    const { scrollable } = this.refs;
    if (!isFetching && nextUrl && !scrollable.canScroll()) {
      loadData(nextUrl);
    }
  }

  handleScrollBottom() {
    const { nextUrl, loadData } = this.props;
    if (nextUrl) {
      loadData(nextUrl);
    }
  }

  handleShoutClick(shout, e) {
    if (!this.props.onShoutClick) {
      return;
    }
    e.preventDefault();
    this.props.onShoutClick(shout);
  }

  render() {
    const { isFetching, shouts } = this.props;
    return (
      <Scrollable
        ref="scrollable"
        className="ShoutsScrollableList"
        scrollElement={ () => ReactDOM.findDOMNode(this).parentNode }
        onScrollBottom={ this.handleScrollBottom }
      >
        <div className="ShoutsScrollableList-items">
          { shouts.map(shout =>
            <span key={ shout.id }>
              <ShoutListItem shout={ shout } onClick={ this.handleShoutClick.bind(this, shout) } />
            </span>
          ) }
        </div>
        <Progress animate={ isFetching } />
      </Scrollable>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shouts: getShoutsByUsername(state, ownProps.profile.username),
  ...getPaginationState(state, ownProps.profile.username),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: endpoint => dispatch(loadShoutsByUsername(ownProps.profile.username, endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoutsScrollableList);
