import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import ShoutPrice from './ShoutPrice';
import ShoutType from './ShoutType';
import ShoutLink from './ShoutLink';
import TimeAgo from '../ui/TimeAgo';
import Popover from '../ui/Popover';
import Card, { CardImage, CardBody } from '../ui/Card';

import ProfileAvatar from '../users/ProfileAvatar';
import ProfilePreview from '../users/ProfilePreview';

import { getVariation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('../ui/Card.scss');
  require('./ShoutPreview.scss');
}

function ShoutPreview({ shout, onProfileAvatarClick, showProfile = true, ...props }) {
  return (
    <ShoutLink shout={ shout }>
      <Card className="ShoutPreview" { ...props }>
        <CardImage src={ getVariation(shout.thumbnail, 'medium') } />
        <CardBody>
          { shout.title &&
            <h4>{ shout.title }</h4>
          }
          <div className="ShoutPreview-body">
            <h3>
              <ShoutPrice shout={ shout } />
            </h3>
            <ShoutType shout={ shout } />
          </div>
          <div className="ShoutPreview-footer">
            { showProfile &&
              <Popover
                trigger={ ['hover', 'focus'] }
                overlay={ <ProfilePreview id={ shout.profile.id } /> }
              >
                <span onClick={ onProfileAvatarClick }>
                  <ProfileAvatar profile={ shout.profile } size="small" />
                </span>
              </Popover>
            }
            <TimeAgo date={ shout.datePublished } />
          </div>
        </CardBody>
      </Card>
    </ShoutLink>

  );
}

ShoutPreview.propTypes = {
  shout: PropTypes.object.isRequired,
  onProfileAvatarClick: PropTypes.func.isRequired,
  showProfile: PropTypes.bool,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onProfileAvatarClick: e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(push(`/user/${ownProps.shout.profile.username}`));
  },
});

export default connect(null, mapDispatchToProps)(ShoutPreview);
