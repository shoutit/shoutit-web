import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import CountryFlag from '../location/CountryFlag';
import ListItem from '../layout/ListItem';
import { formatLocation } from '../utils/LocationUtils';

export function LocationListItem({ location, size = 'medium', locale }) {
  return (
    <ListItem
      className="LocationListItem"
      size={ size }
      start={ <CountryFlag code={ location.country } size={ size } /> }
    >
      { formatLocation(location, { showCountry: false, locale }) }
    </ListItem>
  );
}

LocationListItem.propTypes = {
  locale: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(LocationListItem);
