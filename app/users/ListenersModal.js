import React, { PropTypes, Component } from 'react';
import Modal, { Header, Body, Footer } from '../ui/Modal';
import Button from '../ui/Button';
import ListenersScrollableList from '../users/ListenersScrollableList';

export default class ListenersModal extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['listeners', 'listening']),
    profile: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.refs.close.focus();
  }

  render() {
    const { type, profile, ...modalProps } = this.props;
    let title;
    if (type === 'listeners') {
      title = `Listening to ${profile.firstName}`;
    } else {
      title = `${profile.firstName} is listening to`;
    }

    return (
      <Modal {...modalProps} ref="modal" size="small">
        <Header closeButton>
          { title }
        </Header>
        <Body>
          <ListenersScrollableList type={ type } profile={ profile } />
        </Body>
        <Footer>
          <Button ref="close" size="small" action="primary" onClick={ () => this.refs.modal.hide() }>Close</Button>
        </Footer>
      </Modal>
    );
  }

}
