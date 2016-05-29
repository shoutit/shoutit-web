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

export function ReplyFormToolbar({ openShoutModal, openImageUpload }) {
  return (
    <span className="ReplyFormToolbar">
      <span className="ReplyFormToolbar-start">
        <Tooltip overlay="Send a shout">
          <span className="ReplyFormToolbar-item" onClick={ () => openShoutModal() }>
            <Icon name="sparkle" size="x-small" hover />
          </span>
        </Tooltip>
        <Tooltip overlay="Send pictures">
          <FileInput
            multiple
            accept="image/x-png, image/jpeg"
            name="image-modal"
            onChange={ e => openImageUpload([...e.target.files]) }>
            <span className="ReplyFormToolbar-item">
              <Icon name="camera" size="x-small" hover />
            </span>
          </FileInput>
        </Tooltip>
        {/* <Tooltip overlay="Send a profile">
          <span className="ReplyFormToolbar-item" onClick={ openShoutModal.bind(null, 'profile', 'Send a Profile') }>
            <Icon name="profile" size="x-small" />
          </span>
        </Tooltip>*/}
      </span>
      {/* <span className="ReplyFormToolbar-end">
        <Tooltip overlay="Start video call">
          <span className="ReplyFormToolbar-item" onClick={ openShoutModal.bind(null, 'videocall') }>
            <Icon name="video" active size="small" />
          </span>
        </Tooltip>
      </span>*/}
    </span>
  );
}

ReplyFormToolbar.propTypes = {
  openShoutModal: PropTypes.func.isRequired,
  onAttachment: PropTypes.func.isRequired,
  openImageUpload: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({

  openImageUpload: (initialImages) => {
    if (!initialImages || initialImages.length === 0) {
      return;
    }
    dispatch(openModal(
      <ImageUploadModal
        initialImages={ initialImages }
        openOnMount
        submitLabel="Send"
        onSubmit={ images =>
          images.length > 0 && ownProps.onAttachment('images', images) }
      />
    ));
  },

  openShoutModal: () => {
    dispatch(openModal(
      <UserShoutsModal
        title="Send a Shout"
        onShoutClick={ shout => ownProps.onAttachment('shout', shout) }
      />
    ));
  },

});

export default connect(null, mapDispatchToProps)(ReplyFormToolbar);