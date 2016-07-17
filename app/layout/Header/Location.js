import React, { Component, PropTypes } from 'react';
import CountryFlag from '../../location/CountryFlag';

// import './Toolbar.scss';

class Location extends Component {
  static propTypes = {
    hideCity: PropTypes.bool,
    location: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  }
  render() {
    return (
      <div className="Header-location" onClick={ this.props.onClick }>
        <CountryFlag
          rounded={ false }
          code={ this.props.location.country }
          tooltipPlacement="bottom"
          size="small"
        />
        { !this.props.hideCity && <span>{ this.props.location.city }</span> }
      </div>
    );
  }
}

export default Location;
