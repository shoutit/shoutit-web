import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import { PaginationPropTypes } from '../utils/PropTypes';

import Progress from '../widgets/Progress';
import Scrollable from '../layout/Scrollable';
import TagListItem from '../tags/TagListItem';

import { connect } from 'react-redux';
import { loadListeningTags } from '../actions/users';
import { getListeningTags, getPaginationState } from '../reducers/paginated/tagListeningByUser';

import './ListeningTagsScrollableList.scss';

export class ListeningTagsScrollableList extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    onTagClick: PropTypes.func,
    ...PaginationPropTypes,
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

  handleProfileClick(profile, e) {
    e.preventDefault();
    this.props.onTagClick(profile, e);
  }

  handleScrollBottom() {
    const { nextUrl, loadData } = this.props;
    if (nextUrl) {
      loadData(nextUrl);
    }
  }

  render() {
    return (
      <Scrollable
        ref="scrollable"
        className="ListeningTagsScrollableList"
        scrollElement={ () => ReactDOM.findDOMNode(this).parentNode }
        onScrollBottom={ this.handleScrollBottom }
      >
        <div className="ListeningTagsScrollableList-items">
          { this.props.tags.map(tag =>
            <span key={ tag.id }>
              <TagListItem
                popover={ false }
                tag={ tag }
                onClick={
                  this.props.onTagClick ?
                  this.handleProfileClick.bind(this, tag) :
                  undefined
                } />
            </span>
          ) }
        </div>
        <Progress animate={ this.props.isFetching } />
      </Scrollable>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  tags: getListeningTags(state, ownProps.profile),
  ...getPaginationState(state, ownProps.profile),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: endpoint => dispatch(loadListeningTags(ownProps.profile, endpoint)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListeningTagsScrollableList);
