import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Modal, { Header, Body, Footer } from '../ui/Modal';
import Button from '../ui/Button';
import TagListenersScrollableList from '../tags/TagListenersScrollableList';

export default class ListenersModal extends Component {
  static propTypes = {
    tag: PropTypes.object.isRequired,
    category: PropTypes.object,
  };

  componentDidMount() {
    this.refs.close.focus();
  }

  render() {
    const { tag, category, ...modalProps } = this.props;

    return (
      <Modal { ...modalProps } ref="modal" size="small">
        <Header closeButton>
          <FormattedMessage
            id="tagListenersModal"
            defaultMessage="Listening to {name}"
            values={ { name: category ? category.name : tag.name } }
          />
        </Header>
        <Body>
          <TagListenersScrollableList tag={ tag } />
        </Body>
        <Footer>
          <Button ref="close" size="small" action="primary" onClick={ () => this.refs.modal.hide() }>Close</Button>
        </Footer>
      </Modal>
    );
  }

}
