import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import ShoutPrice from './ShoutPrice';
import ShoutType from './ShoutType';
import ShoutLink from './ShoutLink';
import TimeAgo from '../ui/TimeAgo';
import ListItem from '../ui/ListItem';
import Popover from '../ui/Popover';

import CategoryListItem from '../shouts/CategoryListItem';

import ProfileAvatar from '../users/ProfileAvatar';
import ProfilePreview from '../users/ProfilePreview';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('../ui/Card.scss');
  require('./ShoutPreview.scss');
}

function ShoutPreview({ shout, onProfileAvatarClick, onCategoryClick, showProfile = true, showCategory = true }) {
  return (

    <ShoutLink className="Card ShoutPreview" shout={ shout }>
      <div className="ShoutPreview-price">
        <ShoutPrice shout={ shout } />
        { shout.type === 'request' && <ShoutType shout={ shout } /> }
      </div>
      <div className="Card-image-wrapper">
        <div className="Card-image" style={ getStyleBackgroundImage(shout.thumbnail, 'medium') } />
      </div>
      <div className="Card-title">
        { (shout.title || shout.text) &&
          <div className="Card-title-max-height ShoutPreview-title" title={ shout.title }>
            { shout.title || shout.text }
          </div>
        }
        <div className="ShoutPreview-details">
          <ListItem
            className="ShoutPreview-profile"
            size="small"
            start={ showProfile ?
              <Popover className="Test" containerPadding={ -20 } trigger="click" overlay={ <ProfilePreview id={ shout.profile.id } /> }>
                <span onClick={ onProfileAvatarClick }>
                  <ProfileAvatar profile={ shout.profile } size="small" />
                </span>
              </Popover> : null
            }>
            <TimeAgo date={ shout.datePublished } />
          </ListItem>
          { showCategory && <CategoryListItem onClick={ onCategoryClick } category={ shout.category } size="small" /> }
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
  showCategory: PropTypes.bool,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCategoryClick: e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(push(`/search?category=${ownProps.shout.category.slug}`));
  },
  onProfileAvatarClick: e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(push(`/user/${ownProps.shout.profile.username}`));
  },
});

export default connect(null, mapDispatchToProps)(ShoutPreview);
