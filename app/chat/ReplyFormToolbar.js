import React, { PropTypes } from 'react';
import Icon from '../ui/Icon';
import Tooltip from '../ui/Tooltip';
import { connect } from 'react-redux';

import { openModal, closeModal } from '../actions/ui';
import LoggedUserShoutsScrollableList from '../shouts/LoggedUserShoutsScrollableList';

if (process.env.BROWSER) {
  require('./ReplyFormToolbar.scss');
}

export function ReplyFormToolbar({ openModal }) {
  return (
    <span className="ReplyFormToolbar">
      <span className="ReplyFormToolbar-start">
        <Tooltip overlay="Send Shout">
          <span className="ReplyFormToolbar-item" onClick={ openModal.bind(null, 'shout', 'Send a Shout') }>
            <Icon name="sparkle" size="x-small" />
          </span>
        </Tooltip>
        <Tooltip overlay="Send Picture">
          <span className="ReplyFormToolbar-item" onClick={ openModal.bind(null, 'picture', 'Send a Picture') }>
            <Icon name="camera" size="x-small" />
          </span>
        </Tooltip>
        <Tooltip overlay="Send Profile">
          <span className="ReplyFormToolbar-item" onClick={ openModal.bind(null, 'profile', 'Send a Profile') }>
            <Icon name="profile" size="x-small" />
          </span>
        </Tooltip>
      </span>
      <span className="ReplyFormToolbar-end">
        <Tooltip overlay="Start video call">
          <span className="ReplyFormToolbar-item" onClick={ openModal.bind(null, 'videocall') }>
            <Icon name="video" active size="small" />
          </span>
        </Tooltip>
      </span>
    </span>
  );
}

ReplyFormToolbar.propTypes = {
  openModal: PropTypes.func.isRequired,
  onAttachment: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: (type, title) => {
    const options = { title, scrollableBody: true, bsSize: 'small' };
    let modal;
    switch (type) {
      case 'shout':
        modal = (
          <LoggedUserShoutsScrollableList
            onShoutClick={ shout => {
              dispatch(closeModal());
              ownProps.onAttachment('shout', shout);
            } }
          />
        );
        break;
      case 'picture':
        modal = <p>Send a picture</p>;
        break;
      case 'profile':
        modal = <p>Send a profile</p>;
        break;
    }
    dispatch(openModal(modal, options));
  },
});

export default connect(null, mapDispatchToProps)(ReplyFormToolbar);
