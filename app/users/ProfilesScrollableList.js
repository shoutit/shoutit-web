import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';
import ProfileListItem from '../users/ProfileListItem';

import './ProfilesScrollableList.scss';

export default class ProfilesScrollableList extends Component {

  static propTypes = {
    loadData: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    nextUrl: PropTypes.string,
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    onProfileClick: PropTypes.func,
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
    this.props.onProfileClick(profile, e);
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
        className="ProfilesScrollableList"
        scrollElement={ () => ReactDOM.findDOMNode(this).parentNode }
        onScrollBottom={ this.handleScrollBottom }
      >
        <div className="ProfilesScrollableList-items">
          { this.props.profiles.map(profile =>
            <span key={ profile.id }>
              <ProfileListItem
                popover={ false }
                size="large"
                profile={ profile }
                onClick={ this.props.onProfileClick ? this.handleProfileClick.bind(this, profile) : undefined } />
            </span>
          ) }
        </div>
        <Progress animate={ this.props.isFetching } />
      </Scrollable>
    );
  }
}
