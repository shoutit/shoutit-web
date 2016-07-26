/* eslint-disable */

// Just copied from https://github.com/madebysource/animated-scrollto/pull/11 until merged

var requestAnimFrame = (function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})();

var easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

export default function (element, to, duration, direction = 'top', callback) {

  switch (direction) {
    case 'top':
      direction = 'scrollTop';
      break;
    case 'left': 
      direction = 'scrollLeft';
    default:
      break;
  }
  var start = element[direction],
    change = to - start,
    animationStart = +new Date();
  var animating = true;
  var lastpos = null;

  var animateScroll = function () {
    if (!animating) {
      if (callback) { callback(); }
      return;
    }
    requestAnimFrame(animateScroll);
    var now = +new Date();
    var val = Math.floor(easeInOutQuad(now - animationStart, start, change, duration));
    if (lastpos) {
      if (lastpos === element[direction]) {
        lastpos = val;
        element[direction] = val;
      } else {
        animating = false;
      }
    } else {
      lastpos = val;
      element[direction] = val;
    }
    if (now > animationStart + duration) {
      element[direction] = to;
      animating = false;
    }
  };
  requestAnimFrame(animateScroll);
};
