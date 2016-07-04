import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Modal, { Header, Body, Footer } from '../modals';
import Button from '../forms/Button';
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
          <Button ref="close" kind="primary" onClick={ () => this.refs.modal.hide() }>Close</Button>
        </Footer>
      </Modal>
    );
  }

}
