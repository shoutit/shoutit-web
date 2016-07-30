import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import ShoutPrice from './ShoutPrice';
import ShoutType from './ShoutType';
import ShoutLink from './ShoutLink';
import TimeAgo from '../widgets/TimeAgo';
import Popover from '../widgets/Popover';
import Panel from '../layout/Panel';
import Card, { CardImage, CardBody } from '../layout/Card';

import ProfileAvatar from '../users/ProfileAvatar';
import ProfilePreview from '../users/ProfilePreview';

import { hexToCSSRgba } from '../utils/hexToRgba';

import './ShoutPreview.scss';

function ShoutPreview({ shout, onProfileAvatarClick, showDate = true, showProfile = true, link = true, ...props }) {

  const cardStyle = {};
  const bodyStyle = {};
  let promotionLabel;
  if (shout.promotion && !shout.promotion.isExpired) {
    const color = hexToCSSRgba(shout.promotion.label.color);
    const backgroundColor = hexToCSSRgba(shout.promotion.label.bgColor);
    cardStyle.backgroundColor = backgroundColor;
    cardStyle.border = `1px solid ${color}`;
    promotionLabel = (
      <div className="ShoutPreview-promotion" style={ { backgroundColor: color } }>
        { shout.promotion.label.name }
      </div>
    );
  }

  const content = (
    <Panel className="ShoutPreview">
      <Card { ...props } style={ cardStyle }>
        <CardImage src={ shout.thumbnail } />
        <CardBody style={ bodyStyle }>
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
                  overlay={ <ProfilePreview id={ shout.profile.id } /> }>
                  <span onClick={ onProfileAvatarClick }>
                    <ProfileAvatar profile={ shout.profile } size="small" />
                  </span>
                </Popover>
              }
              { showDate && <TimeAgo date={ shout.datePublished } /> }
            </div>
          }
        </CardBody>
      </Card>
      { promotionLabel }
    </Panel>
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
