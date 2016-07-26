import React, { Component, PropTypes } from 'react';
import union from 'lodash/union';

import { getStyleBackgroundImage } from '../utils/DOMUtils';

import SimpleIcon from '../icons/SimpleIcon';

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

  constructor(props) {
    super(props);
    this.handleSlidesScroll = this.handleSlidesScroll.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  state = {
    selectedIndex: 0,
    scrolledIndex: 0,
  }
  componentDidMount() {
    this.refs.slides.addEventListener('scroll', this.handleSlidesScroll);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.images.length !== nextProps.images.length ||
      this.props.videos.length !== nextProps.videos.length) {
      this.setState({ selectedIndex: 0 });
    }
  }
  componentWillUnmount() {
    this.refs.slides.removeEventListener('scroll', this.handleSlidesScroll);
  }
  handleSlidesScroll() {
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

  next() {
    this.setState({ selectedIndex: this.state.selectedIndex + 1 });
  }
  previous() {
    this.setState({ selectedIndex: this.state.selectedIndex - 1 });
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
        <div className="Gallery-content">
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
          { items.length > 1 &&
            <div className="Gallery-nav">
              { selectedIndex > 0 &&
                <span onClick={ this.previous }>
                  <SimpleIcon colorName="WHITE" rotate="left" name="chevron" size="huge" />
                </span>
              }
              { selectedIndex < items.length - 1 &&
                <span onClick={ this.next }>
                  <SimpleIcon colorName="WHITE" name="chevron" size="huge" />
                </span>
              }
            </div>
          }
        </div>
        { images.length > 1 &&
          <div className="Gallery-thumbnails">
          { items.map((item, i) =>
            <span key={ i }
              onClick={ () => this.setState({ selectedIndex: i }) }
              className={ `Gallery-thumbnail-wrapper${(selectedIndex === i) ? ' selected' : ''}` }
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
