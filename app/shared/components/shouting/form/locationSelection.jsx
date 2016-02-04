import React from 'react';

export default React.createClass({
  displayName: "LocationSelection",

  getInitialState() {
    return {
      gmap: null,
      marker: null
    };
  },

  render() {
    return (<div ref="mapContainer" className="locationInput"></div>);
  },

  componentDidMount()
  {
    if (window.google && window.google.maps) {
      let mapContainer = this.refs.mapContainer,
        gmaps = window.google.maps,
        gmap = new gmaps.Map(mapContainer.getDOMNode(), {
          zoom: 10,
          center: this.props.startLocation,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true
        });
      this.addMapEventListeners(gmap);
      this.setState({
        gmap
      });
    }
  },

  addMapEventListeners(gmap)
  {
    window.google.maps.event.addListener(gmap, 'click', function (e) {
      if (this.props.onChange) {
        this.props.onChange(e.latLng);
      }
    }.bind(this));
  },

  componentDidUpdate()
  {
    if (this.props.selected) {
      if (this.state.marker) {
        console.log("Changing Marker");
        this.state.marker.setPosition(this.props.selected);
      } else {
        console.log("Creating Marker");
        this.setState({
          marker: new window.google.maps.Marker({
            position: this.props.selected,
            map: this.state.gmap
          })
        });
      }
    }
  }
});
