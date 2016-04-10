import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./UserAvatar.scss');
}

export default class UserAvatar extends Component {

  getImageNode() {
    return this.refs.image;
  }

  render() {
    const {
      user = {},
      tooltip = false,
      linkToUserPage = false,
      placeholder = false,  // show placeholder behind the image (default true when user has no image)
      size = 'medium',     // small, medium, large or huge
      mask,               // apply the shoutit logo mask, works only on white backgrounds
    } = this.props;

    const { image, username, name } = user;

    let className = 'UserAvatar';

    if (size) {
      className += ` size-${size}`;
    }
    if (mask) {
      className += ' mask';
    }
    if (!user.image || placeholder) {
      className += ' placeholder';
    }

    let avatar = null;
    if (image) {
      avatar = <span style={ getStyleBackgroundImage(image, size === 'huge' ? 'large' : size) } className="UserAvatar-image" />;
    }
    if (linkToUserPage) {
      avatar = <Link className={ className } to={ `/user/${username}` }>{ avatar }</Link>;
    } else {
      avatar = <span className={ className } ref="image">{ avatar }</span>;
    }
    //
    // if (tooltip) {
    //   avatar = (
    //       // <OverlayTrigger placement="top" overlay={ <Tooltip>{ name }</Tooltip> }>
    //         { avatar }
    //       // </OverlayTrigger>
    //     );
    // }

    return avatar;
  }

}
