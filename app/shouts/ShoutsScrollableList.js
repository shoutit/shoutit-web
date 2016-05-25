import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { getShoutsByUsername } from '../selectors';
import { loadShoutsByUsername } from '../actions/users';

import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';
// import ShoutListItem from '../shouts/ShoutListItem';

if (process.env.BROWSER) {
  require('./ShoutsScrollableList.scss');
}

export class ShoutsScrollableList extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    loadData: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    nextUrl: PropTypes.string,
    shouts: PropTypes.arrayOf(PropTypes.object).isRequired,
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
              { shout.title }
              { /* <ShoutListItem size="large" shout={ shout } />*/ }
            </span>
          ) }
        </div>
        <Progress animate={ isFetching } size="small" />
      </Scrollable>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shouts: getShoutsByUsername(state, ownProps.profile.username),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: endpoint => dispatch(loadShoutsByUsername(ownProps.profile.username, endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoutsScrollableList);
