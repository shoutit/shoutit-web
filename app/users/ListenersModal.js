import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal, { Header, Body, Footer } from '../modals';
import Button from '../forms/Button';
import ListenersScrollableList from '../users/ListenersScrollableList';

export default class ListenersModal extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['listeners', 'listening']),
    profile: PropTypes.object.isRequired,
  }

  static defaultProps = {
    type: 'listeners',
  }

  componentDidMount() {
    this.refs.close.focus();
  }

  render() {
    const { type, profile, ...modalProps } = this.props;
    return (
      <Modal { ...modalProps } ref="modal" size="small">
        <Header closeButton>
          <FormattedMessage
            id="listenersModal.title"
            defaultMessage="{type, select,
              listeners {Listening to {firstName}}
              listening {{firstName} is listening to}
            }"
            values={ { type, firstName: profile.firstName } }
          />
        </Header>
        <Body>
          <ListenersScrollableList type={ type } profile={ profile } />
        </Body>
        <Footer>
          <Button
            ref="close"
            kind="primary"
            onClick={ () => this.refs.modal.hide() }>
            <FormattedMessage
              id="listenersModal.closeButton"
              defaultMessage="Close"
            />
          </Button>
        </Footer>
      </Modal>
    );
  }

}
