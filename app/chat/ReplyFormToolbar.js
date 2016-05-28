import React, { PropTypes } from 'react';
import Icon from '../ui/Icon';
import Tooltip from '../ui/Tooltip';
import { connect } from 'react-redux';

import { openModal } from '../actions/ui';
import UserShoutsModal from '../shouts/UserShoutsModal';
import ImageUploadModal from '../ui/ImageUploadModal';
import FileInput from '../ui/FileInput';

if (process.env.BROWSER) {
  require('./ReplyFormToolbar.scss');
}

export function ReplyFormToolbar({ openModal }) {
  return (
    <span className="ReplyFormToolbar">
      <span className="ReplyFormToolbar-start">
        <Tooltip overlay="Send a shout">
          <span className="ReplyFormToolbar-item" onClick={ openModal.bind(null, 'shout', 'Send a Shout') }>
            <Icon name="sparkle" size="x-small" />
          </span>
        </Tooltip>
        <Tooltip overlay="Send pictures">
          <FileInput
            multiple
            accept="image/x-png, image/jpeg"
            name="image-modal"
            onChange={ e => {
              openModal('image', 'Send Pictures', { initialImages: [...e.target.files] });
            } }>
            <span className="ReplyFormToolbar-item">
              <Icon name="camera" size="x-small" />
            </span>
          </FileInput>
        </Tooltip>
        {/* <Tooltip overlay="Send a profile">
          <span className="ReplyFormToolbar-item" onClick={ openModal.bind(null, 'profile', 'Send a Profile') }>
            <Icon name="profile" size="x-small" />
          </span>
        </Tooltip>*/}
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
  openModal: (type, title, props) => {
    const options = { title, scrollableBody: true, bsSize: 'small' };
    let modal;
    switch (type) {
      case 'shout':
        modal = (
          <UserShoutsModal
            title="Send a Shout"
            onShoutClick={ shout => ownProps.onAttachment('shout', shout) }
          />
        );
        break;
      case 'image':
        if (props.initialImages.length === 0) {
          return;
        }
        modal = (
          <ImageUploadModal
            { ...props }
            openOnMount
            submitLabel="Send"
            onSubmit={ images => images.length > 0 && ownProps.onAttachment('images', images) }
          />
        );
        break;
      case 'profile':
        modal = <p>Send a profile</p>;
        break;
    }
    dispatch(openModal(modal, options));
  },
});

export default connect(null, mapDispatchToProps)(ReplyFormToolbar);
