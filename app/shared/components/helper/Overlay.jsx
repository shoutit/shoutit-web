import React from "react";
import { Overlay as ReactOverlay } from "react-overlays";

if (process.env.BROWSER) {
  require("styles/components/Overlay.scss");
}

const ArrowStyle = {
  position: "absolute",
  width: 0, height: 0,
  borderRightColor: "transparent",
  borderLeftColor: "transparent",
  borderTopColor: "transparent",
  borderBottomColor: "transparent",
  borderStyle: "solid",
  opacity: .75
};

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: "0 5px" },
    arrow: {
      right: 0, marginTop: -5, borderWidth: "5px 0 5px 5px", borderLeftColor: "#000"
    }
  },
  right: {
    tooltip: { marginRight: 3, padding: "0 5px" },
    arrow: { left: 0, marginTop: -5, borderWidth: "5px 5px 5px 0", borderRightColor: "#000" }
  },
  top: {
    tooltip: { marginTop: -3, padding: "5px 0" },
    arrow: { bottom: 0, marginLeft: -5, borderWidth: "5px 5px 0", borderTopColor: "#000" }
  },
  bottom: {
    tooltip: { marginBottom: 3, padding: "5px 0" },
    arrow: { top: 0, marginLeft: -5, borderWidth: "0 5px 5px", borderBottomColor: "#000" }
  }
};


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


export default function Overlay({ arrow, inverted, placement="bottom", children, style, className, ...overlayProps }) {

  if (!process.env.BROWSER) {
    return null;
  }
  let overlayClassName = `Overlay ${placement}`;
  if (arrow) {
    overlayClassName += " arrow";
  }
  if (className) {
    overlayClassName += ` ${className}`;
  }
  if (inverted) {
    overlayClassName += " inverted";
  }

  return (
    <ReactOverlay placement={ placement } {...overlayProps}>
      <OverlayWrapper arrow={ arrow } style={ style } className={ overlayClassName }>
        { children }
      </OverlayWrapper>
    </ReactOverlay>
  );
}
