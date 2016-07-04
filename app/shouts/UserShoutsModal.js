import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getLoggedUser } from '../reducers/session';
import ShoutsScrollableList from './ShoutsScrollableList';
import Modal, { Header, Footer, Body } from '../modals';
import Button from '../forms/Button';

export class UserShoutsModal extends Component {

  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    onShoutClick: PropTypes.func.isRequired,
    title: PropTypes.string,
  }

  static defaultProps = {
    title: 'Your Shouts',
  }

  constructor(props) {
    super(props);
    this.handleShoutClick = this.handleShoutClick.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    this.refs.close.focus();
  }

  handleShoutClick(shout) {
    this.hide();
    this.props.onShoutClick(shout);
  }

  hide() {
    this.refs.modal.hide();
  }

  render() {
    const { loggedUser, title, ...modalProps } = this.props;
    return (
      <Modal { ...modalProps } size="small" ref="modal">
        <Header closeButton>
          { title || <FormattedMessage id="userShoutsModal.title" defaultMessage="Your Shouts" /> }
        </Header>
        <Body>
          <ShoutsScrollableList profile={ loggedUser } onShoutClick={ this.handleShoutClick } />
        </Body>
        <Footer>
          <Button ref="close" kind="primary" onClick={ this.hide }>
            <FormattedMessage id="userShoutsModal.closeButton" defaultMessage="Close" />
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ loggedUser: getLoggedUser(state) });

export default connect(mapStateToProps)(UserShoutsModal);
