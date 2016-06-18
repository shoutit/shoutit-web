import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import CountryFlag from '../ui/CountryFlag';
import ListItem from '../ui/ListItem';
import { formatLocation } from '../utils/LocationUtils';

export function LocationListItem({ location, size = 'medium', intl }) {
  return (
    <ListItem
      className="LocationListItem"
      size={ size }
      start={ <CountryFlag code={ location.country } size={ size } /> }
    >
      { formatLocation(location, { showCountry: false, locale: intl.locale }) }
    </ListItem>
  );
}

LocationListItem.propTypes = {
  intl: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default injectIntl(LocationListItem);
