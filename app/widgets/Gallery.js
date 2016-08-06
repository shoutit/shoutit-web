import React, { Component, PropTypes } from 'react';
import union from 'lodash/union';
import debounce from 'lodash/debounce';

import { connect } from 'react-redux';

import { backgroundImageStyle } from '../utils/DOMUtils';
import animatedScrollTo from '../utils/animatedScrollTo';
import { isRtl } from '../reducers/i18n';
import SimpleIcon from '../icons/SimpleIcon';

import './Gallery.scss';

export class Gallery extends Component {

  static propTypes = {
    images: PropTypes.array,
    videos: PropTypes.array,
    rtl: PropTypes.bool,
  }

  static defaultProps = {
    images: [],
    videos: [],
    rtl: false,
  }

  constructor(props) {
    super(props);
    this.handleScroll = debounce(this.handleScroll.bind(this), 200);
    this.scrollToNext = this.scrollToNext.bind(this);
    this.scrollToPrevious = this.scrollToPrevious.bind(this);
    this.renderSlide = this.renderSlide.bind(this);
    this.renderThumbnail = this.renderThumbnail.bind(this);
    this.state = this.getStateFromProps(props);
  }

  componentDidMount() {
    this.refs.slides.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.images !== nextProps.images ||
      this.props.videos !== nextProps.videos) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }

  componentWillUnmount() {
    this.refs.slides.removeEventListener('scroll', this.handleScroll);
  }

  getStateFromProps(props) {
    const items = union(
      props.videos.map(video => ({ ...video, type: 'video' })),
      props.images.map(image => ({ type: 'image', url: image })),
    );
    return {
      items,
      currentIndex: 0,
    };
  }

  handleScroll(e) {
    let currentIndex = Math.round(e.target.scrollLeft / e.target.offsetWidth);
    if (this.props.rtl) {
      currentIndex = this.state.items.length - 1 - currentIndex;
    }
    this.setState({ currentIndex });
  }

  scrollToNext() {
    this.scrollTo(this.state.currentIndex + 1);
  }

  scrollToPrevious() {
    this.scrollTo(this.state.currentIndex - 1);
  }

  scrollTo(index) {
    const { offsetWidth, scrollWidth } = this.refs.slides;
    let scrollLeft = index * offsetWidth;
    if (this.props.rtl) {
      scrollLeft = scrollWidth - scrollLeft - offsetWidth;
    }
    this.setState({ currentIndex: index });
    animatedScrollTo(this.refs.slides, scrollLeft, 200, 'left');
  }

  renderSlide(item, i) {
    const { rtl } = this.props;
    let style;
    if (rtl) {
      style = {
        left: `${i * -100}%`,
        right: `${i * 100}%`,
      };
    } else {
      style = {
        left: `${i * 100}%`,
        right: `${i * -100}%`,
      };
    }
    return (
      <div key={ i } className="Gallery-slide" style={ style }>
        { item.type === 'image' &&
          <span
            key={ `image-${item.url}` }
            style={ backgroundImageStyle({ url: item.url, variation: 'large', usePlaceholder: false, size: 'contain' }) }
          />
        }
        { item.type === 'video' &&
          <span key={ `video-${item.url}` } className="Gallery-video">
            <video src={ item.url } controls />
          </span>
        }
      </div>
    );
  }

  renderNavbar() {
    if (this.state.items.length <= 1) {
      return null;
    }
    const { rtl } = this.props;
    const { currentIndex } = this.state;

    const previous = currentIndex > 0 ?
      <span
        className="Gallery-nav-previous"
        onClick={ this.scrollToPrevious }
        onMouseDown={ e => e.preventDefault() }>
        <SimpleIcon colorName="WHITE" rotate={ rtl ? 'left' : 'right' } name="chevron" size="huge" />
      </span> : null;

    const next = currentIndex < this.state.items.length - 1 ?
      <span
        className="Gallery-nav-next"
        onClick={ this.scrollToNext }
        onMouseDown={ e => e.preventDefault() }>
        <SimpleIcon colorName="WHITE" rotate={ rtl ? 'right' : 'left' } name="chevron" size="huge" />
      </span> : null;

    return (
      <div className="Gallery-nav">
        { previous }
        { next }
      </div>
    );
  }

  renderThumbnail(item, i) {
    let wrapperClassName = 'Gallery-thumbnail-wrapper';
    if (this.state.currentIndex === i) {
      wrapperClassName += ' selected';
    }
    const className = `Gallery-thumbnail ${item.type}`;
    const style = backgroundImageStyle({ url: item.thumbnailUrl || item.url, variation: 'small' });
    return (
      <span
        href="#"
        tabIndex={ 0 }
        key={ i }
        onClick={ () => { this.scrollTo(i); } }
        onFocus={ () => { this.scrollTo(i); } }
        className={ wrapperClassName }>
        <span className={ className } style={ style } />
      </span>
    );
  }

  render() {
    return (
      <div className="Gallery">
        <div
          ref="content"
          className="Gallery-content">
          <div className="Gallery-slides" ref="slides">
            { this.state.items.map(this.renderSlide) }
          </div>
          { this.renderNavbar() }
        </div>
        { this.state.items.length > 1 &&
          <div className="Gallery-thumbnails">
            { this.state.items.map(this.renderThumbnail) }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rtl: isRtl(state),
});

export default connect(mapStateToProps)(Gallery);
