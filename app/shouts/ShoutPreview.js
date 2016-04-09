import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import ShoutPrice from './ShoutPrice';
import ShoutLink from './ShoutLink';
import TimeAgo from '../ui/TimeAgo';
import SVGIcon from '../ui/SVGIcon';
import ListItem from '../ui/ListItem';
import Tooltip from '../ui/Tooltip';

import UserAvatar from '../users/UserAvatar';
import ProfileOverlay from '../users/ProfileOverlay';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('../ui/Card.scss');
  require('./ShoutPreview.scss');
}

function ShoutPreview({ shout, onProfileAvatarClick, onCategoryClick, showProfile = true }) {
  return (

    <ShoutLink className="Card ShoutPreview" shout={ shout }>
      <ShoutPrice shout={ shout } />
      <div className="Card-image-wrapper">
        <div className="Card-image" style={ getStyleBackgroundImage(shout.thumbnail) } />
      </div>
      <div className="Card-title">
        { shout.title && <div className="Card-title-max-height ShoutPreview-title" title={shout.title}>
          { shout.title }
        </div> }
        <div className="ShoutPreview-details">
          <ListItem
            className="ShoutPreview-profile"
            size="small"
            start={ showProfile &&
              <Tooltip
                destroyTooltipOnHide
                mouseLeaveDelay={0.05}
                white
                placement="top"
                overlay={ <ProfileOverlay id={ shout.profile.id } /> }>
                <span onClick={ onProfileAvatarClick }>
                  <UserAvatar user={ shout.profile } size="small" />
                </span>
              </Tooltip>
            }>
            <TimeAgo date={ shout.datePublished } />
          </ListItem>
          <ListItem onClick={ onCategoryClick } className="ShoutPreview-category" size="small" start={ <SVGIcon size="small" name="tag" /> }>
            { shout.category.name || shout.category }
          </ListItem>
        </div>
      </div>
    </ShoutLink>

  );
}

ShoutPreview.propTypes = {
  shout: PropTypes.object.isRequired,
  showProfile: PropTypes.bool,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCategoryClick: e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(push(`/interest/${ownProps.shout.category.name || ownProps.shout.category}`));
  },
  onProfileAvatarClick: e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(push(`/user/${ownProps.shout.profile.username}`));
  },
});

export default connect(null, mapDispatchToProps)(ShoutPreview);
