import React, { PropTypes, Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import ProfileAvatar from '../users/ProfileAvatar';
import { getVariation } from '../utils/APIUtils';

import { getStyleBackgroundImage } from '../utils/DOMUtils';
import Button from '../ui/Button';

if (process.env.BROWSER) {
  require('./ProfileCover.scss');
}

export const width = 904;
export const height = 250;

export default class ProfileCover extends Component {

  static propTypes = {
    profile: PropTypes.shape({ cover: PropTypes.string }),
  }

  state = {
    isEditing: false,
  }

  render() {
    const { profile } = this.props;
    const { isEditing } = this.state;
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
              <AvatarEditor width={ width } height={ height } image={ profile.cover } border={ 0 } />
              <div className="ProfileCover-instructions">
                Drag to reposition
              </div>
            </div>
          }

          { false && profile.isOwner && !isEditing &&
            <Button
              size="small"
              className="ProfileCover-edit-button"
              inverted
              label={ profile.cover ? 'Edit cover' : 'Add cover image' }
              onClick={ () => this.setState({ isEditing: true }) }
            />
          }
        </div>

        { isEditing &&
          <div className="ProfileCover-actions">
            <Button destructive label="Delete cover" size="small" />
            <Button label="Cancel" onClick={ () => this.setState({ isEditing: false }) } />
            <Button primary label="Save changes" />
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
