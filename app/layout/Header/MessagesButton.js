/* eslint-env browser */
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Icon from '../../widgets/Icon';
import Overlay from '../../widgets/Overlay';

import MessagesOverlay from './MessagesOverlay';
import { getUnreadConversationsCount } from '../../reducers/session';

export class MessagesButton extends Component {

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
        <Link to="/messages" onClick={ this.showOverlay } style={ { position: 'relative' } }>
          <Icon ref={ el => { this.icon = el; } } name="balloon-dots" badge={ this.props.badge } />
        </Link>
        <Overlay
          arrow
          rootClose
          style={ { width: 400, marginLeft: 4 } }
          show={ this.state.showOverlay }
          placement="bottom"
          container={ () => document.getElementsByClassName('Header')[0] }

          onHide={ this.hideOverlay }
          target={ () => this.icon.getIconNode() }>
          <MessagesOverlay closeOverlay={ this.hideOverlay } />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  badge: getUnreadConversationsCount(state),
});

export default connect(mapStateToProps)(MessagesButton);
