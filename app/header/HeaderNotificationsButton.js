import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import SVGIcon from '../ui/SVGIcon';
import Overlay from '../ui/Overlay';

import HeaderNotificationsOverlay from './HeaderNotificationsOverlay';

export class HeaderNotificationsButton extends Component {

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

  showOverlay() {
    this.setState({ showOverlay: true });
  }

  hideOverlay() {
    this.setState({ showOverlay: false });
  }

  render() {
    const { badge } = this.props;
    return (
      <span>
        <SVGIcon ref="icon" onClick={ this.showOverlay } name="bell" badge={ badge } />
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
          <HeaderNotificationsOverlay />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = () => ({
  badge: 0, // state.session.user.stats.unreadNotificationsCount,
});

export default connect(mapStateToProps)(HeaderNotificationsButton);
