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

let scrollTop;
export function preventBodyScroll() {
  const log = debug('shoutit:preventBodyScroll');
  function on() {
    scrollTop = document.body.scrollTop;
    log('Prevent body scroll is enabled, scrolltop is %s', scrollTop);
    document.body.style.top = `${-scrollTop}px`;
    document.body.classList.add('no-scroll');
  }
  function off() {
    log('Prevent body scroll is disabled, restoring scrollTop to %s', scrollTop);
    document.body.style.top = '';
    document.body.scrollTop = scrollTop;
    document.body.classList.remove('no-scroll');
    window.scroll(0, scrollTop);
  }
  return { on, off };
}
