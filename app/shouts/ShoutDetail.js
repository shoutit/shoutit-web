import React, { PropTypes } from 'react';

import CategoryListItem from './CategoryListItem';
import TimeAgo from '../ui/TimeAgo';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import NewlineToBreak from '../ui/NewlineToBreak';
import Button from '../ui/Button';
import Gallery from '../ui/Gallery';
import UserAvatar from '../users/UserAvatar';
import ProfileListItem from '../users/ProfileListItem';

if (process.env.BROWSER) {
  require('./ShoutDetail.scss');
}

export default function ShoutDetail({ shout }) {

  return (
    <div className="ShoutDetail">
      <div className="ShoutDetail-header">

        <div className="ShoutDetail-title">
          <h1>{ shout.title || shout.text }</h1>
          <Button size="small" primary leftIcon = { <Icon fill name="balloon-dots" /> } label="Buy this item" />
        </div>
        <div className="ShoutDetail-header-details">
          <ProfileListItem tooltipPlacement="bottom" profile={ shout.profile } />

          <ListItem start={ <Icon name="clock" /> }>
            <TimeAgo date={ shout.datePublished } />
          </ListItem>

          <CategoryListItem size="medium" category={ shout.category } />
          <ListItem start={ <Icon name="location" /> }>
            { shout.location.city || shout.location.state || shout.location.country }
          </ListItem>


        </div>

      </div>
      <div className="ShoutDetail-body">

          { shout.images &&
            <div className="ShoutDetail-gallery">
              <Gallery images={ shout.images } />
            </div>
          }

          <div className="ShoutDetail-text">

            <p>
              <NewlineToBreak>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </NewlineToBreak>
            </p>

          </div>
      </div>
    </div>
  );
}

ShoutDetail.propTypes = {
  shout: PropTypes.object.isRequired,
};
