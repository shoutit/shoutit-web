/* eslint-env browser */

import { getVariation } from './APIUtils';
import { imagesPath } from '../config';
import debug from 'debug';

export function getDocumentScrollTop() {
  if (window.pageYOffset !== 'undefined') {
    return window.pageYOffset;
  }
  if (document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }
  if (document.body.scrollTop) {
    return document.body.scrollTop;
  }
  return 0;
}

/**
 * Get the style to use an image as background:
 * `url`: the image URL on S3
 * `variation`: the S3 image variation to use
 * `size`: `cover` or `contain`
 * `usePlaceholder`: if url is undefined, will use a placeholder image
 *
 * @export
 * @param {Object} { url, variation, size = 'cover', usePlaceholder = true }
 * @returns
 */
export function backgroundImageStyle({ url, variation, size = 'cover', usePlaceholder = true } = {}) {
  if (!url) {
    if (!usePlaceholder) {
      return null;
    }
    return {
      backgroundImage: `url("${imagesPath}/pattern@2x.png")`,
      backgroundSize: '250px 409px',
      backgroundRepeat: 'repeat',
    };
  }
  return {
    backgroundImage: `url("${variation ? getVariation(url, variation) : url}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: size,
    backgroundPosition: 'center',
  };
}

export function blurActiveElement() {
  if (!document || !document.activeElement || !document.activeElement.blur) {
    return;
  }
  document.activeElement.blur();
}

let scrollTop;
export function preventBodyScroll() {
  const log = debug('shoutit:preventBodyScroll');
  function on() {
    scrollTop = getDocumentScrollTop();
    if (document.documentElement.clientHeight === document.documentElement.scrollHeight) {
      log('Skip preventing body scroll as documentElement is not scrollable');
      return;
    }
    log('Prevent body scroll is enabled, scrolltop is %s', scrollTop);
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.style.overflowY = 'scroll';
    document.documentElement.style.top = `${-scrollTop}px`;
    document.documentElement.style.height = `${document.documentElement.clientHeight + scrollTop}px`;
  }
  function off() {
    log('Prevent body scroll is disabled, restoring scrollTop to %s', scrollTop);
    document.documentElement.style.position = '';
    document.documentElement.style.width = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.top = '';
    document.documentElement.style.height = '';
    document.documentElement.scrollTop = scrollTop;
    document.documentElement.classList.remove('no-scroll');
    window.scroll(0, scrollTop);
  }
  return { on, off };
}
