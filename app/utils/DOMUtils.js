import { getVariation } from './APIUtils';
import { imagesPath } from '../config';
import debug from 'debug';

export function getStyleBackgroundImage(path, variation) {
  if (!path) {
    return {
      backgroundImage: `url("${imagesPath}/pattern@2x.png")`,
      backgroundSize: '250px 409px',
      backgroundRepeat: 'repeat',
    };
  }
  return {
    backgroundImage: `url("${variation ? getVariation(path, variation) : path}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

export function preventBodyScroll(scrollable) {
  const log = debug('shoutit:preventBodyScroll');

  function onWheel(scrollable) {
    return e => {
      let preventScroll = false;
      const isScrollingDown = e.deltaY > 0;
      if (isScrollingDown) {
        const isAtBottom = scrollable.scrollTop + scrollable.offsetHeight === scrollable.scrollHeight;
        if (isAtBottom) {
          log('Scrollable is scrolling down and at bottom, prevent scrolling');
          preventScroll = true;
        }
      } else {
        const isAtTop = scrollable.scrollTop === 0;
        if (isAtTop) {
          log('Scrollable is at top, prevent scrolling');
          preventScroll = true;
        }
      }
      if (preventScroll) {
        e.preventDefault();
      }
    };
  }
  function on() {
    log('Prevent body scroll is enabled');
    document.body.onmousewheel = onWheel(scrollable);
    document.body.onwheel = onWheel(scrollable);
  }
  function off() {
    log('Prevent body scroll is disabled');
    document.body.onmousewheel = null;
    document.body.onwheel = null;
  }
  return { on, off };
}
