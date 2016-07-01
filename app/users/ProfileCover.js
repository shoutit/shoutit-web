/* eslint-env browser */
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

import ReactAvatarEditor from 'react-avatar-editor';
import { connect } from 'react-redux';

import request from '../utils/request';
import { getStyleBackgroundImage, preventBodyScroll } from '../utils/DOMUtils';
import { getFilename } from '../utils/StringUtils';
import { updateProfile } from '../actions/users';

import ProfileAvatar from '../users/ProfileAvatar';
import ProfileAvatarEditable from '../users/ProfileAvatarEditable';
import Button from '../ui/Button';
import UploadButton from '../ui/UploadButton';

import './ProfileCover.scss';

export const height = 250;

export class ProfileCover extends Component {

  static propTypes = {
    profile: PropTypes.shape({ cover: PropTypes.string }),
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handlePictureChange = this.handlePictureChange.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.state = {
      image: props.profile.cover,
      isEditing: false,
      isLoading: false,
      uploadRequest: null,
    };
  }

  handlePictureChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = event => this.setState({
        image: event.target.result,
        isEditing: true,
      });
      fileReader.readAsDataURL(files[0]);
    }
  }

  startEditing() {
    preventBodyScroll().on();
    this.setState({ isEditing: true });
  }

  cancelEditing() {
    if (this.state.uploadRequest) {
      this.state.uploadRequest.abort();
    }
    preventBodyScroll().off();
    this.setState({
      isEditing: false,
      isLoading: false,
      uploadRequest: null,
      image: this.props.profile.cover,
    });
  }

  handleSaveClick() {
    const { profile, dispatch } = this.props;
    const image = this.refs.editor.getImage();

    const uploadRequest = request.post('/api/file/user')
      .send({ image })
      .end((err, res) => {
        if (err) {
          this.setState({
            isLoading: false,
            uploadRequest: null,
            image: profile.cover,
          });
          return;
        }
        this.setState({ uploadRequest: null });
        dispatch(updateProfile({ id: profile.id, cover: res.text }))
          .then(() => this.cancelEditing());
      });

    this.setState({
      isLoading: true,
      image,
      uploadRequest,
    });

  }

  handleDeleteClick() {
    const { profile, dispatch } = this.props;
    this.setState({ isLoading: true });
    request
      .delete('/api/file/user')
      .query({ name: getFilename(profile.cover) })
      .end((err, res) => {
        if (err || !res.ok) {
          console.error(err); // eslint-disable-line
          return;
        }
      });
    dispatch(updateProfile({ id: profile.id, cover: null })).then(this.cancelEditing);
  }

  render() {
    const { profile } = this.props;
    const { isEditing, isLoading, image } = this.state;
    const style = {
      ...getStyleBackgroundImage(profile.cover, 'large'),
      height,
    };
    let className = 'ProfileCover';
    if (isEditing) {
      className += ' is-editing';
    }
    return (
      <div className={ className }>
        <div className="ProfileCover-image" style={ style }>

          { isEditing &&
            <div>
              <ReactAvatarEditor
                ref="editor"
                width="100%"
                height={ height }
                image={ image }
                border={ 0 }
              />
              { profile.cover !== image && !isLoading &&
                <div className="ProfileCover-instructions">
                  <FormattedMessage
                    id="profileCover.dragInstructions"
                    defaultMessage="Drag to reposition"
                  />
                </div>
              }
            </div>
          }

          { profile.isOwner && image &&
            <div className="ProfileCover-edit">
              { !isEditing &&
                <Button
                  block
                  kind="inverted"
                  icon={ profile.cover ? 'pencil' : 'camera' }
                  onClick={ this.startEditing }>
                  <FormattedMessage
                    id="profileCover.editButton"
                    defaultMessage="Edit Cover"
                  />
                </Button>
              }
              { isEditing && !isLoading && profile.cover !== image &&
                <UploadButton
                  name="upload-cover"
                  accept="image/jpeg,image/png"
                  block
                  kind="inverted"
                  onChange={ this.handlePictureChange }
                  icon="camera">
                  <FormattedMessage
                    id="profileCover.uploadButton"
                    defaultMessage="Upload Image"
                  />
                </UploadButton>
              }
            </div>
          }

          { profile.isOwner && !image &&
            <div className="ProfileCover-edit">
              <UploadButton
                name="upload-cover"
                accept="image/jpeg,image/png"
                block
                kind="inverted"
                onChange={ this.handlePictureChange }
                icon="camera">
                <FormattedMessage
                  id="profileCover.addButton"
                  defaultMessage="Add Cover"
                />
              </UploadButton>
            </div>
          }

        </div>

        { isEditing &&
          <div className="ProfileCover-actions">
            <Button onClick={ this.cancelEditing } size="small" disabled={ isLoading }>
              <FormattedMessage
                id="profileCover.cancelButton"
                defaultMessage="Cancel"
              />
            </Button>
            { profile.cover && profile.cover === image &&
              <Button name="upload-cover" size="small" disabled={ isLoading } kind="destructive" onClick={ this.handleDeleteClick }>
                <FormattedMessage
                  id="profileCover.deleteButton"
                  defaultMessage="Delete"
                />
              </Button>
            }
            { profile.cover === image &&
              <UploadButton
                name="upload-cover"
                accept="image/jpeg,image/png"
                size="small"
                kind="secondary"
                style={ { minWidth: 120 } }
                icon="camera"
                disabled={ isLoading }
                onChange={ this.handlePictureChange }>
                <FormattedMessage
                  id="profileCover.uploadButton"
                  defaultMessage="Upload Image"
                />
              </UploadButton>
            }
            { profile.cover !== image &&
              <Button onClick={ this.handleSaveClick } kind="primary" disabled={ profile.cover === image || isLoading } style={ { minWidth: 120 } }>
                <FormattedMessage
                  id="profileCover.saveButton"
                  defaultMessage="{isLoading, select,
                  true {Saving…}
                  false {Save changes}
                 }"
                  values={ { isLoading } }
                />
              </Button>
            }
          </div>
        }

        <div className="ProfileCover-header">
          <div className="ProfileCover-avatar">
            { profile.isOwner && !isEditing ?
              <ProfileAvatarEditable size="huge" profile={ profile } /> :
              <ProfileAvatar size="huge" profile={ profile } />
            }
          </div>

          { !isEditing &&
            <div className="ProfileCover-name">
              <h1>{ profile.name }</h1>
              <h3>{ profile.username }</h3>
            </div>
          }

        </div>
      </div>

    );
  }
}

export default connect()(ProfileCover);
