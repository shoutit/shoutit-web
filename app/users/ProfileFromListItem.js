import React, { PropTypes } from 'react';
import CountryFlag from '../ui/CountryFlag';
import ListItem from '../ui/ListItem';

export default function ProfileFromListItem({ profile, size = 'medium' }) {
  const { location } = profile;
  if (!location) {
    return <div />;
  }
  return (
    <ListItem
      className="ProfileFromListItem"
      size={ size }
      start={ <CountryFlag code={ location.country } size={ size } /> }
    >
      { `from ${location.city || location.state || location.country}` }
    </ListItem>
  );
}

ProfileFromListItem.propTypes = {
  profile: PropTypes.object.isRequired,
};
