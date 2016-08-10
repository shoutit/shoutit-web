import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';
import CountryFlag from '../location/CountryFlag';
import ListItem from '../layout/ListItem';
import { formatLocation } from '../utils/LocationUtils';

export function LocationListItem({ location, size = 'medium', language }) {
  return (
    <ListItem
      className="LocationListItem"
      size={ size }
      start={ <CountryFlag code={ location.country } size={ size } /> }
    >
      { formatLocation(location, { showCountry: false, language }) }
    </ListItem>
  );
}

LocationListItem.propTypes = {
  language: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});

export default connect(mapStateToProps)(LocationListItem);
