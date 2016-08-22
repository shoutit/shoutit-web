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
    user: PropTypes.object.isRequired,
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
    return (
      <span>
        <Link
          className="HeaderProfile-profileLink"
          to={ `/user/${this.props.user.username}` }
          onClick={ this.props.overlay && this.showOverlay }>
          <ProfileAvatar ref={ el => { this.avatar = el; } } profile={ this.props.user } size="medium" />
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
            <ProfileOverlay onItemClick={ this.hideOverlay } />
          </Overlay>
        }
      </span>
    );
  }
}

const mapStateToProps = state => ({
  user: getLoggedUser(state),
});

export default connect(mapStateToProps)(ProfileButton);
