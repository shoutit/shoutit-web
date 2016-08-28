import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ProfileAvatar from '../../users/ProfileAvatar';
import Overlay from '../../widgets/Overlay';

import ProfileOverlay from './ProfileOverlay';
import { getLoggedUser } from '../../reducers/session';

export class ProfileButton extends Component {

  static propTypes = {
    overlay: PropTypes.bool,
    profile: PropTypes.object.isRequired,
  }

  static defaultProps = {
    overlay: true,
  }

  constructor(props) {
    super(props);
    this.showOverlay = this.showOverlay.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
  }

  state = {
    showOverlay: false,
  }

  avatar = null

  showOverlay(e) {
    e.preventDefault();
    this.setState({ showOverlay: true });
  }

  hideOverlay() {
    this.setState({ showOverlay: false });
  }

  render() {
    const { profile } = this.props;
    return (
      <span>
        <Link
          className="HeaderProfile-profileLink"
          to={ `/user/${profile.profilename}` }
          onClick={ this.props.overlay && this.showOverlay }>
          <ProfileAvatar ref={ el => { this.avatar = el; } } profile={ profile } size="medium" />
        </Link>
        { this.props.overlay &&
          <Overlay
            arrow
            inverted
            rootClose
            style={ { minWidth: 150, padding: '0 .5rem' } }
            show={ this.state.showOverlay }
            placement="bottom"
            onHide={ this.hideOverlay }
            target={ () => this.avatar.getImageNode() }
          >
            <ProfileOverlay closeOverlay={ this.hideOverlay } />
          </Overlay>
        }
      </span>
    );
  }
}

const mapStateToProps = state => ({
  profile: getLoggedUser(state),
});

export default connect(mapStateToProps)(ProfileButton);
