import React, { PropTypes } from 'react';
import CountryFlag from '../ui/CountryFlag';
import ListItem from '../ui/ListItem';
import { formatLocation } from '../utils/LocationUtils';

export default function LocationListItem({ location, size = 'medium' }) {
  return (
    <ListItem
      className="LocationListItem"
      size={ size }
      start={ <CountryFlag code={ location.country } size={ size } /> }
    >
      { formatLocation({ state: location.state, city: location.city }) }
    </ListItem>
  );
}

LocationListItem.propTypes = {
  location: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
