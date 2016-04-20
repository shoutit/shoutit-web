import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import ProfileAvatar from '../users/ProfileAvatar';
import Overlay from '../ui/Overlay';

import HeaderProfileOverlay from './HeaderProfileOverlay';

export class HeaderProfileButton extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    overlayContainer: PropTypes.node,
  }

  constructor(props) {
    super(props);
    this.showOverlay = this.showOverlay.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
  }

  state = {
    showOverlay: false,
  }

  showOverlay(e) {
    e.preventDefault();
    this.setState({ showOverlay: true });
  }

  hideOverlay() {
    this.setState({ showOverlay: false });
  }

  render() {
    const { user } = this.props;
    return (
      <span>
        <Link
          className="HeaderProfile-profileLink"
          to={`/user/${user.username}`}
          onClick={ this.showOverlay }>
            <ProfileAvatar ref="avatar" user={ user } size="large" />
        </Link>
        <Overlay
          arrow
          inverted
          rootClose
          style={{ minWidth: 150, padding: '0 .5rem' }}
          show={ this.state.showOverlay }
          placement="bottom"
          container={ this.props.overlayContainer }
          onHide={ this.hideOverlay }
          target={ () => this.refs.avatar.getImageNode() }
        >
          <HeaderProfileOverlay onItemClick={ this.hideOverlay } />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  user: state.session.user,
});

export default connect(mapStateToProps)(HeaderProfileButton);
