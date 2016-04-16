import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import ShoutPrice from './ShoutPrice';
import ShoutLink from './ShoutLink';
import TimeAgo from '../ui/TimeAgo';
import ListItem from '../ui/ListItem';
import Tooltip from '../ui/Tooltip';

import CategoryListItem from './CategoryListItem';

import UserAvatar from '../users/UserAvatar';
import ProfilePreview from '../users/ProfilePreview';

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
        <div className="Card-image" style={ getStyleBackgroundImage(shout.thumbnail, 'medium') } />
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
                mouseLeaveDelay={ 0.05 }
                white
                placement="top"
                overlay={ <ProfilePreview id={ shout.profile.id } /> }>
                <span onClick={ onProfileAvatarClick }>
                  <UserAvatar user={ shout.profile } size="small" />
                </span>
              </Tooltip>
            }>
            <TimeAgo date={ shout.datePublished } />
          </ListItem>
          <CategoryListItem onClick={ onCategoryClick } category={ shout.category } size="small" />
        </div>
      </div>
    </ShoutLink>

  );
}

ShoutPreview.propTypes = {
  shout: PropTypes.object.isRequired,
  onProfileAvatarClick: PropTypes.func.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
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
