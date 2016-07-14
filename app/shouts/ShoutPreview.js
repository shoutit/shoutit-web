import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import ShoutPrice from './ShoutPrice';
import ShoutType from './ShoutType';
import ShoutLink from './ShoutLink';
import TimeAgo from '../widgets/TimeAgo';
import Popover from '../widgets/Popover';
import Card, { CardImage, CardBody } from '../layout/Card';

import ProfileAvatar from '../users/ProfileAvatar';
import ProfilePreview from '../users/ProfilePreview';


if (process.env.BROWSER) {
  require('../layout/Card.scss');
  require('./ShoutPreview.scss');
}

function ShoutPreview({ shout, onProfileAvatarClick, showDate = true, showProfile = true, link = true, ...props }) {

  const content = (
    <Card className="ShoutPreview" { ...props }>
      <CardImage src={ shout.thumbnail } />
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
        { (showProfile || showDate) &&
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
            { showDate &&
              <TimeAgo date={ shout.datePublished } />
            }
          </div>
         }
      </CardBody>
    </Card>
  );
  if (!link) {
    return <span className="ShoutPreview-container">{ content }</span>;
  }
  return (
    <ShoutLink shout={ shout }>
      { content }
    </ShoutLink>
  );
}

ShoutPreview.propTypes = {
  link: PropTypes.bool,
  shout: PropTypes.object.isRequired,
  onProfileAvatarClick: PropTypes.func.isRequired,
  showProfile: PropTypes.bool,
  showDate: PropTypes.bool,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onProfileAvatarClick: e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(push(`/user/${ownProps.shout.profile.username}`));
  },
});

export default connect(null, mapDispatchToProps)(ShoutPreview);
