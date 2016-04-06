import React, { PropTypes } from 'react';
import ListItem from '../ui/ListItem';
import SVGIcon from '../ui/SVGIcon';

export default function ProfileWebsiteListItem({ profile, size = 'medium' }) {
  let { website } = profile;
  website = "https://www.test.com/test/test/test/test/test/test";
  if (!website) {
    return <div />;
  }
  return (
    <a href={ website } target="_blank">
      <ListItem
        className="ProfileWebsiteListItem"
        size={ size }
        start={ <SVGIcon name="world-west" active size={ size } /> }
      >
        { website.replace(/https?:\/\//, '') }
      </ListItem>
    </a>
  );
}

ProfileWebsiteListItem.propTypes = {
  profile: PropTypes.object.isRequired,
};
