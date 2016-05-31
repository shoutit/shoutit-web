import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { getUnreadNotificationsCount } from '../selectors';
import Icon from '../ui/Icon';
import Overlay from '../ui/Overlay';

import HeaderNotificationsOverlay from './HeaderNotificationsOverlay';

export class HeaderNotificationsButton extends Component {

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

  showOverlay() {
    this.setState({ showOverlay: true });
  }

  hideOverlay() {
    this.setState({ showOverlay: false });
  }

  render() {
    const { badge, overlayContainer } = this.props;
    return (
      <span>
        <Icon ref="icon" onClick={ this.showOverlay } name="bell" badge={ badge } />
        <Overlay
          arrow
          rootClose
          style={ { width: 400, marginLeft: 4 } }
          show={ this.state.showOverlay }
          placement="bottom"
          container={ overlayContainer }
          onHide={ this.hideOverlay }
          target={ () => this.refs.icon.getIconNode() }
        >
          <HeaderNotificationsOverlay closeOverlay={ this.hideOverlay } />
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  badge: getUnreadNotificationsCount(state),
});

export default connect(mapStateToProps)(HeaderNotificationsButton);
