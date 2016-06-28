import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import { getLoggedUser } from '../reducers/session';
import ListenersScrollableList from './ListenersScrollableList';
import Modal, { Header, Footer, Body, BodyFixed } from '../ui/Modal';
import Button from '../ui/Button';
import SegmentedControl from '../ui/SegmentedControl';

import './ProfilesModal.scss';

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
export class ProfilesModal extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    onProfileClick: PropTypes.func.isRequired,
    title: PropTypes.string,
  }

  static defaultProps = {
    title: 'Profiles',
  }

  constructor(props) {
    super(props);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.hide = this.hide.bind(this);
  }

  state = {
    type: 'listeners',
  }

  componentDidMount() {
    this.refs.close.focus();
  }

  handleProfileClick(profile) {
    this.hide();
    this.props.onProfileClick(profile);
  }

  hide() {
    this.refs.modal.hide();
  }

  render() {
    const { title, intl, ...modalProps } = this.props;
    return (
      <Modal { ...modalProps } size="small" ref="modal">
        <Header closeButton>
          { title }
        </Header>
        <BodyFixed>
          <div className="ProfilesModal-selectedControl">
            <SegmentedControl value={ this.state.type } ref="type" name="type" options={ [
              { label: intl.formatMessage(MESSAGES.listeners), value: 'listeners' },
              { label: intl.formatMessage(MESSAGES.listening), value: 'listening' },
            ] } onChange={ type => this.setState({ type }) } />
          </div>
        </BodyFixed>
        <Body>
          <ListenersScrollableList
            profile={ this.props.profile }
            type={ this.state.type }
            onProfileClick={ this.handleProfileClick }
          />
        </Body>
        <Footer>
          <Button ref="close" kind="primary" onClick={ this.hide }>
            { intl.formatMessage(MESSAGES.hide) }
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  profile: getLoggedUser(state),
});

export default connect(mapStateToProps)(injectIntl(ProfilesModal));
