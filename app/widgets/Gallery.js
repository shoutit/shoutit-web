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
    scrolledIndex: 0,
  }

  constructor(props) {
    super(props);
    this.handleSlidesScroll = this.handleSlidesScroll.bind(this);
  }

  componentDidMount() {
    this.refs.slides.addEventListener('scroll', this.handleSlidesScroll);
  }

  componentWillUnmount() {
    this.refs.slides.removeEventListener('scroll', this.handleSlidesScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.images.length !== nextProps.images.length ||
      this.props.videos.length !== nextProps.videos.length) {
      this.setState({ selectedIndex: 0 });
    }
  }

  handleSlidesScroll(e) {
    // const { scrollLeft, scrollWidth, offsetWidth, children } = e.target;

    // console.log('scrollLeft', scrollLeft, 'scrollWidth', scrollWidth, 'offsetWidth', offsetWidth, 'ratio', scrollWidth / scrollLeft);

    // const scrolledIndex = Math.ceil((200 * scrollLeft / (scrollWidth + offsetWidth))/children.length);
    // console.log('scrollEnd', scrollLeft, 'scrolledIndex', scrolledIndex);
    // if (this.state.scrolledIndex !== scrolledIndex) {
    //   e.preventDefault();
    //   this.setState({
    //     scrolledIndex,
    //   });
    // }
  }

  renderItem(item) {
    if (item.type === 'image') {
      return (
        <span key={ `image-${item.url}` } style={ getStyleBackgroundImage(item.url, 'large', false) } />
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
        <div className="Gallery-slides" ref="slides">

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
              className={ `Gallery-thumbnail-wrapper${(this.state.scrolledIndex === i || selectedIndex === i) ? ' selected' : ''}` }
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
