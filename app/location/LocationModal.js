import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Modal, { Header, Body, Footer } from '../modals';
import Button from '../forms/Button';

import SearchLocation from '../location/SearchLocation';
import { updateCurrentLocation } from '../actions/location';

export class LocationModal extends Component {
  static propTypes = {
    onLocationSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
  }

  modal = null

  handleLocationSelect(location) {
    this.modal.hide();
    this.props.onLocationSelect(location);
  }

  render() {
    return (
      <Modal { ...this.props } ref={ el => { this.modal = el; } } size="small">
        <Header closeButton>
          <FormattedMessage
            id="locationModal.title"
            defaultMessage="Change your location"
          />
        </Header>
        <Body>
          <SearchLocation onLocationSelect={ this.handleLocationSelect } />
        </Body>
        <Footer>
          <Button kind="primary" onClick={ () => this.modal.hide() }>
            <FormattedMessage
              id="locationModal.closeButton"
              defaultMessage="Close"
            />
          </Button>
        </Footer>
      </Modal>
    );
  }

}

const mapDispatchToProps = dispatch => ({
  onLocationSelect: location => dispatch(updateCurrentLocation(location)),
});
export default connect(null, mapDispatchToProps)(LocationModal);
