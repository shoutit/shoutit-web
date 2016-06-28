import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal, { Header, Body, Footer } from '../ui/Modal';
import Button from '../ui/Button';
import ListeningTagsScrollableList from '../users/ListeningTagsScrollableList';

export default class ListeningTagsModal extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.refs.close.focus();
  }

  render() {
    const { profile, ...modalProps } = this.props;
    return (
      <Modal { ...modalProps } ref="modal" size="small">
        <Header closeButton>
          <FormattedMessage
            id="users.ListeningTagsModal.title"
            defaultMessage="{firstName}’s interests"
            values={ { firstName: profile.firstName } }
          />
        </Header>
        <Body>
          <ListeningTagsScrollableList profile={ profile } />
        </Body>
        <Footer>
          <Button ref="close"
            size="small"
            kind="primary"
            onClick={ () => this.refs.modal.hide() }>
            <FormattedMessage
              id="users.ListeningTagsModal.close"
              defaultMessage="Close"
            />
          </Button>
        </Footer>
      </Modal>
    );
  }

}
