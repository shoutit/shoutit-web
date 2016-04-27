import React, { PropTypes, Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { width, height } from './ProfileCover';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./ProfileCover.scss');
}

export default class ProfileCoverEditable extends Component {

  static propTypes = {
    profile: PropTypes.shape({ cover: PropTypes.string }),
  }
  render() {
    const { profile } = this.props;
    return (
      <div className="ProfileCover editable" ref="node">
        <div className="ProfileCover-editor">
          <AvatarEditor width={ width } height={ height } image={ profile.cover } border={ 0 } />
          <div className="ProfileCover-instructions">
            Drag to reposition
          </div>
        </div>
        <div className="ProfileCover-actions">
          <button>Cancel</button>
          <button>Save changes</button>
        </div>
      </div>
    );
  }
}
