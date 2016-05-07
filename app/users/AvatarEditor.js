import React, { PropTypes, Component } from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import { connect } from 'react-redux';
import { updateProfile } from '../actions/users';
import { getFilename } from '../utils/StringUtils';
import request from '../utils/request';

import Form from '../ui/Form';
import Button from '../ui/Button';
import UploadButton from '../ui/UploadButton';

export const width = 250;
export const height = 250;

if (process.env.BROWSER) {
  require('./AvatarEditor.scss');
}

export class AvatarEditor extends Component {

  static propTypes = {
    image: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.handlePictureChange = this.handlePictureChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.state = {
      image: props.image,
      uploadRequest: null,
      scale: 1,
    };
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
              image: profile.image,
            });
            return;
          }
          this.setState({ uploadRequest: null });
          dispatch(updateProfile({ id: profile.id, image: res.text }))
            .then(() => this.cancelEditing());
        });

    this.setState({
      isLoading: true,
      uploadRequest,
    });

  }

  handleDeleteClick() {
    const { profile, dispatch } = this.props;
    this.setState({ isLoading: true });
    request
        .delete('/api/file/user')
        .query({ name: getFilename(profile.image) })
        .end((err, res) => {
          if (err || !res.ok) {
            console.error(err); // eslint-disable-line
            return;
          }
        });
    dispatch(updateProfile({ id: profile.id, image: null })).then(this.cancelEditing);
  }

  handlePictureChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = event => this.setState({
        image: event.target.result,
      });
      fileReader.readAsDataURL(files[0]);
    }
  }

  handleScale() {
    const scale = parseFloat(this.refs.scale.value);
    this.setState({ scale });
  }

  handleDrop() {
    this.setState({
      image: this.refs.editor.getImage(),
    });
  }

  cancelEditing() {
    if (this.state.uploadRequest) {
      this.state.uploadRequest.abort();
    }
    this.props.onCancel();
  }

  render() {
    const { profile } = this.props;
    const { image, isLoading, scale } = this.state;
    const actions = [];
    actions.push(
      <Button onClick={ this.cancelEditing } size="small" disabled={ isLoading }>
        Cancel
      </Button>
    );
    if (profile.image && profile.image === image) {
      actions.push(
        <Button name="upload-image" size="small" disabled={ isLoading } action="destructive" onClick={ this.handleDeleteClick }>
          Delete
        </Button>
      );
    }
    actions.push(<UploadButton
      name="upload-image"
      accept="image/jpeg,image/png"
      size="small"
      action="primary-alt"
      style={ { minWidth: 120 } }
      icon="camera"
      disabled={ isLoading }
      onChange={ this.handlePictureChange }>
        { image ? 'Change picture' : 'Choose a picture' }
    </UploadButton>);

    if (image && profile.image !== image) {
      actions.push(
        <Button onClick={ this.handleSaveClick } action="primary" size="small" disabled={ profile.image === image || isLoading } style={ { minWidth: 120 } }>
          { isLoading ? 'Saving…' : 'Save changes' }
        </Button>
      );
    }


    return (
      <Form className="AvatarEditor" actions={ actions }>
        <div>
          { image ?
            <ReactAvatarEditor
              scale={ scale }
              ref="editor"
              width={ width }
              height={ height }
              image={ image }
              border={ 0 }
              onDropFile={ this.handleDrop }
            />
            :
            <span className="AvatarEditor-placeholder" style={ { width, height } } />
          }
        </div>

        { image && profile.image !== image &&
          <div>
            <input disabled={ isLoading } name="scale" type="range" ref="scale" onChange={ this.handleScale } min="1" max="3" step="0.01" defaultValue="1" />
          </div>
        }
      </Form>
    );
  }
}

export default connect()(AvatarEditor);
