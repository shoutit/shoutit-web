import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getLoggedProfile } from '../reducers/session';

import { openModal } from '../actions/ui';
import SelectProfileModal from '../users/SelectProfileModal';
import SelectShoutModal from '../shouts/SelectShoutModal';
import ImageUploadModal from '../modals/ImageUploadModal';
import Icon from '../widgets/Icon';
import Tooltip from '../widgets/Tooltip';
import FileInput from '../forms/FileInput';

import './ReplyFormToolbar.scss';

export function ReplyFormToolbar({ openShoutModal, openImageUpload, openSelectProfileModal, loggedUser }) {
  return (
    <span className="ReplyFormToolbar">
      <span className="ReplyFormToolbar-start">
        <Tooltip
          overlay={
            <FormattedMessage
              id="chat.replyFormToolbar.attachShout.buttonTooltip"
              defaultMessage="Send a Shout" />
          }>
          <span className="ReplyFormToolbar-item" onClick={ () => openShoutModal(loggedUser) }>
            <Icon name="sparkle" size="x-small" hover />
          </span>
        </Tooltip>
        <Tooltip
          overlay={
            <FormattedMessage
              id="chat.replyFormToolbar.attachPictures.buttonTooltip"
              defaultMessage="Send pictures" />
          }>
          <FileInput
            multiple
            accept="image/png,image/jpeg"
            name="image-modal"
            onChange={ e => openImageUpload([...e.target.files]) }>
            <span className="ReplyFormToolbar-item">
              <Icon name="camera" size="x-small" hover />
            </span>
          </FileInput>
        </Tooltip>
        { (loggedUser.listeningCount.users > 0 || loggedUser.listenersCount > 0) &&
          <Tooltip
            overlay={
              <FormattedMessage
                id="chat.replyFormToolbar.attachProfile.buttonTooltip"
                defaultMessage="Send a profile" />
            }>
            <span className="ReplyFormToolbar-item" onClick={ () => openSelectProfileModal(loggedUser) }>
              <Icon name="profile" size="x-small" hover />
            </span>
          </Tooltip>
        }
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
  loggedUser: PropTypes.object.isRequired,
  onAttachment: PropTypes.func.isRequired,
  openSelectProfileModal: PropTypes.func.isRequired,
  openShoutModal: PropTypes.func.isRequired,
  openImageUpload: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedUser: getLoggedProfile(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({

  openImageUpload: initialImages => {
    if (!initialImages || initialImages.length === 0) {
      return;
    }
    dispatch(openModal(
      <ImageUploadModal
        initialImages={ initialImages }
        openOnMount
        submitLabel={
          <FormattedMessage
            id="chat.replyFormToolbar.attachPictures.submitLabel"
            defaultMessage="Send"
          />
        }
        onSubmit={ images =>
          images.length > 0 && ownProps.onAttachment('images', images) }
      />
    ));
  },

  openShoutModal: profile => {
    dispatch(openModal(
      <SelectShoutModal
        profile={ profile }
        title={
          <FormattedMessage
            id="chat.replyFormToolbar.attachShout.modalTitle"
            defaultMessage="Send a Shout"
          />
        }
        onSelect={ shout => ownProps.onAttachment('shout', shout) }
      />
    ));
  },

  openSelectProfileModal: profile => {
    dispatch(openModal(
      <SelectProfileModal
        profile={ profile }
        title={
          <FormattedMessage
            id="chat.replyFormToolbar.attachProfile.modalTitle"
            defaultMessage="Send a Profile"
          />
        }
        onSelect={ profile => ownProps.onAttachment('profile', profile) }
      />
    ));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(ReplyFormToolbar);
