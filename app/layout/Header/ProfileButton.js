import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import ProfileAvatar from '../../users/ProfileAvatar';
import Overlay from '../../widgets/Overlay';

import ProfileOverlay from './ProfileOverlay';
import { getLoggedUser } from '../../reducers/session';
export class ProfileButton extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    overlayContainer: PropTypes.oneOfType([PropTypes.object, PropTypes.element, PropTypes.func]),
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
          to={ `/user/${user.username}` }
          onClick={ this.showOverlay }>
          <ProfileAvatar ref="avatar" profile={ user } size="medium" />
        </Link>
        <Overlay
          arrow
          inverted
          rootClose
          style={ { minWidth: 150, padding: '0 .5rem' } }
          show={ this.state.showOverlay }
          placement="bottom"
          onHide={ this.hideOverlay }
          target={ () => this.refs.avatar.getImageNode() }
        >
          <ProfileOverlay onItemClick={ this.hideOverlay } />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  user: getLoggedUser(state),
});

export default connect(mapStateToProps)(ProfileButton);
