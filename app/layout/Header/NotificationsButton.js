/* eslint-env browser */
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { getUnreadNotificationsCount } from '../../reducers/session';
import Icon from '../../widgets/Icon';
import Overlay from '../../widgets/Overlay';

import NotificationsOverlay from './NotificationsOverlay';

export class NotificationsButton extends Component {

  static propTypes = {
    badge: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.showOverlay = this.showOverlay.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
  }

  state = {
    showOverlay: false,
  }

  icon = null

  showOverlay() {
    this.setState({ showOverlay: true });
  }

  hideOverlay() {
    this.setState({ showOverlay: false });
  }

  render() {
    return (
      <span>
        <Icon ref={ el => this.icon = el } onClick={ this.showOverlay } name="bell" badge={ this.props.badge } />
        <Overlay
          arrow
          rootClose
          style={ { width: 400, marginLeft: 4 } }
          show={ this.state.showOverlay }
          placement="bottom"
          container={ () => document.getElementsByClassName('Header')[0] }
          onHide={ this.hideOverlay }
          target={ () => this.icon.getIconNode() }
        >
          <NotificationsOverlay closeOverlay={ this.hideOverlay } />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  badge: getUnreadNotificationsCount(state),
});

export default connect(mapStateToProps)(NotificationsButton);
