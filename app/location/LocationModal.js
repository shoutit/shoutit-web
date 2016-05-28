import React, { PropTypes, Component } from 'react';
import Modal, { Header, Body, Footer } from '../ui/Modal';
import Button from '../ui/Button';

import SearchLocation from '../location/SearchLocation';

export default class LocationModal extends Component {
  static propTypes = {
    onLocationSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
  }

  handleLocationSelect(location) {
    this.refs.modal.hide();
    if (this.props.onLocationSelect) {
      this.props.onLocationSelect(location);
    }
  }

  render() {
    return (
      <Modal {...this.props} ref="modal" size="small">
        <Header closeButton>
          Change your Location
        </Header>
        <Body>
          <SearchLocation ref="search" onLocationSelect={ this.handleLocationSelect } />
        </Body>
        <Footer>
          <Button ref="close" size="small" action="primary" onClick={ () => this.refs.modal.hide() }>
            Close
          </Button>
        </Footer>
      </Modal>
    );
  }

}
