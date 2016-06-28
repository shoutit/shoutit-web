import React, { Component, PropTypes } from 'react';

import { getVariation } from '../utils/APIUtils';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import union from 'lodash/union';

import './Gallery.scss';

export default class Gallery extends Component {

  static propTypes = {
    images: PropTypes.array,
    videos: PropTypes.array,
  }

  static defaultProps = {
    images: [],
    videos: [],
  }

  state = {
    selectedIndex: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.images.length !== nextProps.images.length ||
      this.props.videos.length !== nextProps.videos.length) {
      this.setState({ selectedIndex: 0 });
    }
  }

  renderItem(item) {
    if (item.type === 'image') {
      return (
        <img role="presentation" key={ `image-${item.url}` } src={ getVariation(item.url, 'large') } />
      );
    } else if (item.type === 'video') {
      return (
        <span key={ `video-${item.url}` } className="Gallery-video">
          <video src={ item.url } controls />
        </span>
      );
    }
    return null;
  }

  render() {
    const { images, videos } = this.props;

    const items = union(
      videos.map(video => ({ ...video, type: 'video' })),
      images.map(image => ({ type: 'image', url: image })),
    );
    const { selectedIndex } = this.state;
    const offset = selectedIndex * 100;
    return (
      <div className="Gallery">
        <div className="Gallery-slides">

          { items.map((item, i) =>
            <div
              key={ i }
              className="Gallery-slide"
              style={ { left: `${i * 100 - offset}%`, right: `${i * -100 + offset}%` } }
              >
              { this.renderItem(item, i) }
            </div>
           ) }

        </div>

        { images.length > 1 &&
          <div className="Gallery-thumbnails">
          { items.map((item, i) =>
            <span key={ i }
              onClick={ () => this.setState({ selectedIndex: i }) }
              className={ `Gallery-thumbnail-wrapper${selectedIndex === i ? ' selected' : ''}` }
            >
              <span
                className={ `Gallery-thumbnail ${item.type}` }
                style={ item.thumbnailUrl ? getStyleBackgroundImage(item.thumbnailUrl, 'small') : getStyleBackgroundImage(item.url, 'small') }
              />
            </span>

           ) }
          </div>

        }
      </div>
    );
  }
}
