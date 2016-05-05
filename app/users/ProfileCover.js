import React, { PropTypes, Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { connect } from 'react-redux';

import request from '../utils/request';
import { getVariation } from '../utils/APIUtils';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { getFilename } from '../utils/StringUtils';

import { updateProfile } from '../actions/users';

import ProfileAvatar from '../users/ProfileAvatar';
import Button from '../ui/Button';
import UploadButton from '../ui/UploadButton';

if (process.env.BROWSER) {
  require('./ProfileCover.scss');
}

export const width = 904;
export const height = 250;

export class ProfileCover extends Component {

  static propTypes = {
    profile: PropTypes.shape({ cover: PropTypes.string }),
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handlePictureChange = this.handlePictureChange.bind(this);
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

  cancelEditing() {
    if (this.state.uploadRequest) {
      this.state.uploadRequest.abort();
    }
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
      width, height,
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
              <AvatarEditor ref="editor" width={ width } height={ height } image={ getVariation(image, 'large') } border={ 0 } />
              { profile.cover !== image && !isLoading &&
                <div className="ProfileCover-instructions">
                  Drag to reposition
                </div>
              }
            </div>
          }

          { profile.isOwner && image &&
            <div className="ProfileCover-edit">
              { !isEditing &&
                <Button
                  size="small"
                  block
                  action="inverted"
                  icon={ profile.cover ? 'pencil' : 'camera' }
                  onClick={ () => this.setState({ isEditing: true }) }>
                  Edit cover
                </Button>
              }
              { isEditing && !isLoading && profile.cover !== image &&
                <UploadButton
                  name="upload-cover"
                  accept="image/jpeg,image/png"
                  size="small"
                  block
                  action="inverted"
                  onChange={ this.handlePictureChange }
                  icon="camera">
                  Choose another
                </UploadButton>
              }
            </div>
          }

          { profile.isOwner && !image &&
            <div className="ProfileCover-edit">
              <UploadButton
                name="upload-cover"
                accept="image/jpeg,image/png"
                size="small"
                block
                action="inverted"
                onChange={ this.handlePictureChange }
                icon="camera">
                Add cover
              </UploadButton>
            </div>
          }

        </div>

        { isEditing &&
          <div className="ProfileCover-actions">
            <Button onClick={ this.cancelEditing } size="small" disabled={ isLoading }>
              Cancel
            </Button>
            { profile.cover && profile.cover === image &&
              <Button name="upload-cover" size="small" disabled={ isLoading } action="destructive" onClick={ this.handleDeleteClick }>
                Delete
              </Button>
            }
            { profile.cover === image &&
              <UploadButton
                name="upload-cover"
                accept="image/jpeg,image/png"
                size="small"
                action="primary-alt"
                style={ { minWidth: 120 } }
                icon="camera"
                disabled={ isLoading }
                onChange={ this.handlePictureChange }>
                  { profile.cover ? 'Change image' : 'Choose an image' }
              </UploadButton>
            }
            { profile.cover !== image &&
              <Button onClick={ this.handleSaveClick } action="primary" size="small" disabled={ profile.cover === image || isLoading } style={ { minWidth: 120 } }>
                { isLoading ? 'Saving…' : 'Save changes' }
              </Button>
            }
          </div>
        }

        <div className="ProfileCover-header">
          <a href={ profile.image ? getVariation(profile.image, 'large') : '' }>
            <ProfileAvatar size="huge" user={ profile } />
          </a>

          { !isEditing &&
            <div className="ProfileCover-name">
              <h1>
                { profile.name }
              </h1>
              <h3>
                { profile.username }
              </h3>
            </div>
          }

        </div>
      </div>

    );
  }
}

export default connect()(ProfileCover);
