import React from 'react';
import { Overlay as ReactOverlay } from 'react-overlays';

if (process.env.BROWSER) {
  require('styles/components/Overlay.scss');
}

function OverlayWrapper({ arrow, arrowOffsetLeft, arrowOffsetTop, children, style, className }) {
  let arrowStyle;
  if (arrow) {
    arrowStyle = { left: arrowOffsetLeft, top: arrowOffsetTop };
  }
  return (
    <div className={ className } style={ style }>
      { arrow && <div className="Overlay-arrow" style={arrowStyle} /> }
      { children }
    </div>
  );
}

/**
 * Return an Overlay from react-overlays that can add an arrow when passing
 * `arrow={true}`. When setting `inverted` will use the dark version.
 *
 * Docs about react-overlays: https://github.com/react-bootstrap/react-overlays
 *
 * Container element (i.e. that specified by the `container` prop) must have a
 * css relative position!
 *
 */
export default function Overlay({ arrow, inverted, placement = 'bottom', children, style, className, ...overlayProps }) {
  if (!process.env.BROWSER) {
    return <span />;
  }
  let overlayClassName = `Overlay ${placement}`;
  if (arrow) {
    overlayClassName += ' arrow';
  }
  if (className) {
    overlayClassName += ` ${className}`;
  }
  if (inverted) {
    overlayClassName += ' inverted';
  }
  return (
    <ReactOverlay placement={ placement } {...overlayProps}>
      <OverlayWrapper arrow={ arrow } style={ style } className={ overlayClassName }>
        { children }
      </OverlayWrapper>
    </ReactOverlay>
  );
}
