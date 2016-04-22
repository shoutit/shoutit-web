import React, { PropTypes } from 'react';
import ListItem from '../ui/ListItem';
import Icon from '../ui/Icon';

export default function ProfileWebsiteListItem({ profile, size = 'medium' }) {
  let { website } = profile;
  if (!website) {
    return <div />;
  }
  return (
    <a href={ website } target="_blank">
      <ListItem
        className="ProfileWebsiteListItem"
        size={ size }
        start={ <Icon name="world-west" active size={ size } /> }
      >
        { website.replace(/https?:\/\//, '') }
      </ListItem>
    </a>
  );
}

ProfileWebsiteListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};
