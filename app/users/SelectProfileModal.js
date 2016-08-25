import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import {
  getListeningByProfile,
  getPaginationState as getListeningPagination,
} from '../reducers/paginated/listeningByUser';

import {
  getListenersByProfile,
  getPaginationState as getListenersPagination,
} from '../reducers/paginated/listenersByUser';

import { loadListeners, loadListening } from '../actions/users';

import Modal, { Header, Footer, BodyPaginated, BodyFixed } from '../modals';
import Button from '../forms/Button';
import SegmentedControl from '../forms/SegmentedControl';
import ProfileListItem from '../users/ProfileListItem';

const MESSAGES = defineMessages({
  listeners: {
    id: 'profilesModal.segmentedControl.listeners',
    defaultMessage: 'Listeners',
  },
  listening: {
    id: 'profilesModal.segmentedControl.listening',
    defaultMessage: 'Listening',
  },
  hide: {
    id: 'profilesModal.segmentedControl.hideButton',
    defaultMessage: 'Close',
  },
});


export class SelectProfileModal extends Component {

  static propTypes = {
    type: PropTypes.oneOf(['listeners', 'listening']).isRequired,
    title: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,

    listeners: PropTypes.array,
    loadListeners: PropTypes.func.isRequired,
    listenersPagination: PropTypes.shape(PaginationPropTypes),
    listening: PropTypes.array,
    loadListening: PropTypes.func.isRequired,
    listeningPagination: PropTypes.shape(PaginationPropTypes),

    onSelect: PropTypes.func,
  }

  static defaultProps = {
    type: 'listeners',
  }

  constructor(props) {
    super(props);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.state = {
      type: props.type,
    };
  }

  modal = null

  handleProfileClick(profile, e) {
    if (!this.props.onSelect) {
      return;
    }
    e.preventDefault();
    this.modal.hide();
    this.props.onSelect(profile);
  }

  renderBody() {
    const {
      listeners,
      listenersPagination,
      loadListeners,
      listening,
      listeningPagination,
      loadListening,
    } = this.props;

    const props = {};
    let profiles;
    if (this.state.type === 'listeners') {
      profiles = listeners;
      props.loadData = loadListeners;
      props.pagination = listenersPagination;
      props.showProgress = listenersPagination.isFetching && listeners && listeners.length > 0;
    } else {
      profiles = listening;
      props.loadData = loadListening;
      props.pagination = listeningPagination;
      props.showProgress = listeningPagination.isFetching && listening && listening.length > 0;
    }
    return (
      <BodyPaginated { ...props }>
        { profiles && profiles.map(profile =>
          <ProfileListItem
            key={ profile.id }
            popover={ false }
            size="large"
            profile={ profile }
            onClick={ e => this.handleProfileClick(profile, e) } />
        )}
      </BodyPaginated>
    );
  }

  render() {
    const { intl } = this.props;
    const typeOptions = [
      { label: intl.formatMessage(MESSAGES.listeners), value: 'listeners' },
      { label: intl.formatMessage(MESSAGES.listening), value: 'listening' },
    ];
    return (
      <Modal
        { ...this.props }
        ref={ el => this.modal = el }
        loading={ !this.props[this.state.type] }
        size="small" >
        <Header closeButton>
          { this.props.title }
        </Header>
        <BodyFixed>
          <SegmentedControl
            value={ this.state.type }
            ref={ el => this.typeSegmentedControl = el }
            name="type"
            options={ typeOptions }
            onChange={ type => this.setState({ type }) }
          />
        </BodyFixed>
        { this.renderBody() }
        <Footer>
          <Button kind="primary" onClick={ () => this.modal.hide() }>
            Close
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  listening: getListeningByProfile(state, ownProps.profile.id),
  listeningPagination: getListeningPagination(state, ownProps.profile.id),
  listeners: getListenersByProfile(state, ownProps.profile.id),
  listenersPagination: getListenersPagination(state, ownProps.profile.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadListeners: params => dispatch(loadListeners(ownProps.profile, params)),
  loadListenining: params => dispatch(loadListening(ownProps.profile, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SelectProfileModal));
