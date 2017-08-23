/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getCurrentLanguage } from '../reducers/i18n';
import { GOOGLE_MAPS_KEY } from '../config';
import { createLinkToGoogleMaps } from '../utils/GoogleMapsUtils';

import './GoogleStaticMap.scss';

export class GoogleStaticMap extends Component {

  static propTypes = {

    // Pass location or center
    location: PropTypes.object.isRequired,
    center: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),

    zoom: PropTypes.number,
    language: PropTypes.string.isRequired,
    markers: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    mapType: PropTypes.string,
  }

  static defaultProps = {
    center: { latitude: 40.714728, longitude: -73.998672 },
    zoom: 13,
    width: 300,
    height: 200,
    mapType: 'roadmap',
  }
  constructor(props) {
    super(props);
    this.setDimensions = this.setDimensions.bind(this);
    this.state = {
      width: props.width,
      height: props.height,
      scale: 1,
    };
  }
  componentDidMount() {
    this.setDimensions();
    this.setScale();
    window.addEventListener('resize', this.setDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setDimensions);
  }
  setDimensions() {
    this.setState({
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    });
  }
  setScale() {
    this.setState({
      scale: window.devicePixelRatio >= 2 ? 2 : 1,
    });
  }
  node = null
  render() {
    let { center, markers } = this.props;
    if (this.props.location) {
      center = this.props.location;
      markers = [this.props.location];
    }
    const imageUrl = ['https://maps.googleapis.com/maps/api/staticmap?'];

    imageUrl.push(`key=${GOOGLE_MAPS_KEY}`);
    imageUrl.push(`scale=${this.state.scale}`); // for retina displays

    imageUrl.push(`center=${center.latitude},${center.longitude}`);
    imageUrl.push(`zoom=${this.props.zoom}`);
    imageUrl.push(`size=${this.state.width}x${this.state.height}`);
    imageUrl.push(`maptype=${this.props.mapType}`);
    imageUrl.push(`language=${this.props.language}`);

    markers.forEach(marker => {
      const {
        latitude = center.latitude,
        longitude = center.longitude,
        size = 'small',
        color = '0xff0000',
      } = marker;

      imageUrl.push(`markers=size:${size}%7Ccolor:${color}%7Clabel:A%7C${latitude},${longitude}`);
    });

    const href = createLinkToGoogleMaps(this.props.location || center, this.props.language);

    const style = {
      backgroundImage: `url("${imageUrl.join('&')}")`,
      backgroundSize: `${this.state.width}px ${this.state.height}px`,
    };

    return (
      <a ref={ el => { this.node = el; } } href={ href } target="_blank" className="GoogleStaticMap" rel="noopener noreferrer">
        <span style={ style } />
      </a>
    );
  }
}

const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});

export default connect(mapStateToProps)(GoogleStaticMap);
