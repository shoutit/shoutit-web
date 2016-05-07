import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Tooltip from '../ui/Tooltip';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./ProfileAvatar.scss');
}

export default class ProfileAvatar extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    tooltip: PropTypes.bool,
    linkToProfilePage: PropTypes.bool,
    placeholder: PropTypes.bool,
    mask: PropTypes.bool,
    size: PropTypes.oneOf(['medium', 'small', 'large', 'huge']),
  }

  getImageNode() {
    return this.refs.image;
  }

  render() {
    const {
      profile = {},
      tooltip = false,
      linkToProfilePage = false,
      placeholder = false,  // show placeholder behind the image (default true when profile has no image)
      size = 'medium',     // small, medium, large or huge
      mask,               // apply the shoutit logo mask, works only on white backgrounds
    } = this.props;

    const { image, username } = profile;

    let className = 'ProfileAvatar';

    if (size) {
      className += ` size-${size}`;
    }
    if (mask) {
      className += ' mask';
    }
    if (!profile.image || placeholder) {
      className += ' placeholder';
    }

    let avatar = null;
    if (image) {
      avatar = <span style={ getStyleBackgroundImage(image, size === 'huge' ? 'large' : size) } className="ProfileAvatar-image" />;
    }
    if (linkToProfilePage) {
      avatar = <Link className={ className } to={ `/user/${username}` }>{ avatar }</Link>;
    } else {
      avatar = <span className={ className } ref="image">{ avatar }</span>;
    }

    if (tooltip) {
      avatar = (
        <Tooltip placement="top" overlay={ profile.name }>
          { avatar }
        </Tooltip>
        );
    }

    return avatar;
  }

}
