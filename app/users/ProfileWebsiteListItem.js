import React, { PropTypes } from 'react';
import ListItem from '../layout/ListItem';
import Icon from '../widgets/Icon';

export default function ProfileWebsiteListItem({ profile, size = 'medium' }) {
  let { website } = profile;
  if (!website) {
    return <div />;
  }
  return (
    <a href={ website } target="_blank" rel="noopener noreferrer">
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
