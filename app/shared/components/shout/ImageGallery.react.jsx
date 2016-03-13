'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import VideoPlayer from './videoPlayer.jsx';

const ImageGallery = React.createClass({

  displayName: 'ImageGallery',

  propTypes: {
    items: React.PropTypes.array.isRequired,
    showThumbnails: React.PropTypes.bool,
    showBullets: React.PropTypes.bool,
    showNav: React.PropTypes.bool,
    autoPlay: React.PropTypes.bool,
    lazyLoad: React.PropTypes.bool,
    slideInterval: React.PropTypes.number,
    onSlide: React.PropTypes.func,
    startIndex: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      lazyLoad: true,
      showThumbnails: true,
      showBullets: false,
      showNav: true,
      autoPlay: false,
      slideInterval: 4000,
      startIndex: 0
    };
  },

  getInitialState() {
    return {
      currentIndex: this.props.startIndex,
      thumbnailsTranslateX: 0,
      containerWidth: 0
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.containerWidth !== this.state.containerWidth ||
        prevProps.showThumbnails !== this.props.showThumbnails) {

      // adjust thumbnail container when window width is adjusted
      // when the container resizes, thumbnailsTranslateX
      // should always be negative (moving right),
      // if container fits all thumbnails its set to 0

      this._setThumbnailsTranslateX(
        -this._getScrollX(this.state.currentIndex > 0 ? 1 : 0) *
        this.state.currentIndex);

    }

    if (prevState.currentIndex !== this.state.currentIndex) {

      // call back function if provided
      if (this.props.onSlide) {
        this.props.onSlide(this.state.currentIndex);
      }

      // calculates thumbnail container position
      if (this.state.currentIndex === 0) {
        this._setThumbnailsTranslateX(0);
      } else {
        let indexDifference = Math.abs(
          prevState.currentIndex - this.state.currentIndex);
        let scrollX = this._getScrollX(indexDifference);
        if (scrollX > 0) {
          if (prevState.currentIndex < this.state.currentIndex) {
            this._setThumbnailsTranslateX(
              this.state.thumbnailsTranslateX - scrollX);
          } else if (prevState.currentIndex > this.state.currentIndex) {
            this._setThumbnailsTranslateX(
              this.state.thumbnailsTranslateX + scrollX);
          }
        }
      }
    }

  },

  componentDidMount() {
    this._handleResize();
    if (this.props.autoPlay) {
      this.play();
    }
    if (window.addEventListener) {
      window.addEventListener('resize', this._handleResize);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', this._handleResize);
    }
  },

  componentWillUnmount() {
    if (window.removeEventListener) {
      window.removeEventListener('resize', this._handleResize);
    } else if (window.detachEvent) {
      window.detachEvent('onresize', this._handleResize);
    }

    if (this._intervalId) {
      window.clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  slideToIndex(index, event) {
    let slideCount = this.props.items.length - 1;

    if (index < 0) {
      this.setState({currentIndex: slideCount});
    } else if (index > slideCount) {
      this.setState({currentIndex: 0});
    } else {
      this.setState({currentIndex: index});
    }
    if (event) {
      if (this._intervalId) {
        // user event, reset interval
        this.pause();
        this.play();
      }
      event.preventDefault();
    }
  },

  play() {
    if (this._intervalId) {
      return;
    }
    this._intervalId = window.setInterval(() => {
      if (!this.state.hovering) {
        this.slideToIndex(this.state.currentIndex + 1);
      }
    }.bind(this), this.props.slideInterval);
  },

  pause() {
    if (this._intervalId) {
      window.clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  _setThumbnailsTranslateX(x) {
    this.setState({thumbnailsTranslateX: x});
  },

  _handleResize() {
    this.setState({containerWidth: this.refs.imageGallery.offsetWidth});
  },

  _getScrollX(indexDifference) {
    if (this.refs.thumbnails) {
      let thumbNode = this.refs.thumbnails;
      if (thumbNode.scrollWidth <= this.state.containerWidth) {
        return 0;
      }
      let totalThumbnails = thumbNode.children.length;

      // total scroll-x required to see the last thumbnail
      let totalScrollX = thumbNode.scrollWidth - this.state.containerWidth;

      // scroll-x required per index change
      let perIndexScrollX = totalScrollX / (totalThumbnails - 1);

      return indexDifference * perIndexScrollX;
    }
  },

  _handleMouseOver() {
    this.setState({hovering: true});
  },

  _handleMouseLeave() {
    this.setState({hovering: false});
  },

  _getAlignmentClassName(index) {
    let currentIndex = this.state.currentIndex;
    let alignment = '';
    switch (index) {
      case (currentIndex - 1):
        alignment = ' left';
        break;
      case (currentIndex):
        alignment = ' center';
        break;
      case (currentIndex + 1):
        alignment = ' right';
        break;
    }

    if (this.props.items.length >= 3) {
      if (index === 0 && currentIndex === this.props.items.length - 1) {
        // set first slide as right slide if were sliding right from last slide
        alignment = ' right';
      } else if (index === this.props.items.length - 1 && currentIndex === 0) {
        // set last slide as left slide if were sliding left from first slide
        alignment = ' left';
      }
    }

    return alignment;
  },

  render() {
    let currentIndex = this.state.currentIndex;
    let thumbnailStyle = {
      MozTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)',
      WebkitTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)',
      OTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)',
      msTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)',
      transform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)'
    };

    let slides = [];
    let thumbnails = [];
    let bullets = [];

    this.props.items.map((item, index) => {
      let alignment = this._getAlignmentClassName(index);
      let originalClass = item.originalClass ? ' ' + item.originalClass : '';
      let thumbnailClass = item.thumbnailClass ? ' ' + item.thumbnailClass : '';

      let slideItem = item.isVideo?
          <VideoPlayer options={{url: item.original, poster: item.thumbnail}} />:
          <img src={item.original}/>;

      let slide = (
        <div
          key={index}
          className={'image-gallery-slide' + alignment + originalClass}>
          {slideItem}
          {item.description}
        </div>
      );

      if (this.props.lazyLoad) {
        if (alignment) {
          slides.push(slide);
        }
      } else {
        slides.push(slide);
      }

      if (this.props.showThumbnails) {
        thumbnails.push(
          <div
            key={index}
            className={
              'image-gallery-thumbnail' +
              (currentIndex === index ? ' active' : '') +
              thumbnailClass
            }

            style={{backgroundImage: `url(${item.thumbnail})`}}
            onTouchStart={this.slideToIndex.bind(this, index)}
            onClick={this.slideToIndex.bind(this, index)}>

          </div>
        );
      }

      if (this.props.showBullets) {
        bullets.push(
          <li
            key={index}
            className={
              'image-gallery-bullet ' + (
                currentIndex === index ? 'active' : '')}

            onTouchStart={this.slideToIndex.bind(this, index)}
            onClick={this.slideToIndex.bind(this, index)}>
          </li>
        );
      }
    });

    let swipePrev = this.slideToIndex.bind(this, currentIndex - 1);
    let swipeNext = this.slideToIndex.bind(this, currentIndex + 1);

    return (
      <section ref='imageGallery' className='image-gallery'>
        <div
          onMouseOver={this._handleMouseOver}
          onMouseLeave={this._handleMouseLeave}
          className='image-gallery-content'>
          {
            this.props.items.length >= 2 ?
              [
                this.props.showNav &&
                  [
                    <a
                      key='leftNav'
                      className='image-gallery-left-nav'
                      onTouchStart={swipePrev}
                      onClick={swipePrev}/>,
                    <a
                      key='rightNav'
                      className='image-gallery-right-nav'
                      onTouchStart={swipeNext}
                      onClick={swipeNext}/>
                  ],

                <Swipeable
                  key='swipeable'
                  onSwipedLeft={swipeNext}
                  onSwipedRight={swipePrev}>
                  <div className='image-gallery-slides'>
                    {slides}
                  </div>
                </Swipeable>
              ]
            :
              <div className='image-gallery-slides'>
                {slides}
              </div>
          }
          {
            this.props.showBullets &&
              <div className='image-gallery-bullets'>
                <ul className='image-gallery-bullets-container'>
                  {bullets}
                </ul>
              </div>
          }
        </div>

        {
          this.props.showThumbnails &&
            <div className='image-gallery-thumbnails'>
              <div
                ref='thumbnails'
                className='image-gallery-thumbnails-container'
                style={thumbnailStyle}>
                {thumbnails}
              </div>
            </div>
        }
      </section>
    );

  }

});

export default ImageGallery;
