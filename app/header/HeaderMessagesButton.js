import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import SVGIcon from '../ui/SVGIcon';
import Overlay from '../ui/Overlay';

import HeaderMessagesOverlay from './HeaderMessagesOverlay';

export class HeaderMessagesButton extends Component {

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
        <Link to="/messages" onClick={ this.showOverlay } style={{ position: 'relative' }}>
          <SVGIcon ref="icon" name="balloon-dots" badge={ badge } />
        </Link>
        <Overlay
          arrow
          rootClose
          style={ { width: 400, marginLeft: 4 }}
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
  badge: state.session.user.stats.unreadConversationsCount,
});

export default connect(mapStateToProps)(HeaderMessagesButton);
