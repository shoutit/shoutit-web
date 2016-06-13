import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Icon from '../ui/Icon';
import Overlay from '../ui/Overlay';

import HeaderMessagesOverlay from './HeaderMessagesOverlay';
import { getUnreadConversationsCount } from '../reducers/session';

export class HeaderMessagesButton extends Component {

  static propTypes = {
    badge: PropTypes.number,
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
    const { badge } = this.props;
    return (
      <span>
        <Link to="/messages" onClick={ this.showOverlay } style={ { position: 'relative' } }>
          <Icon ref="icon" name="balloon-dots" badge={ badge } />
        </Link>
        <Overlay
          arrow
          rootClose
          style={ { width: 400, marginLeft: 4 } }
          show={ this.state.showOverlay }
          placement="bottom"
          container={ this.props.overlayContainer }
          onHide={ this.hideOverlay }
          target={ () => this.refs.icon.getIconNode() }
        >
          <HeaderMessagesOverlay closeOverlay={ this.hideOverlay } />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  badge: getUnreadConversationsCount(state),
});

export default connect(mapStateToProps)(HeaderMessagesButton);
