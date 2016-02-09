import React from "react";

if (process.env.BROWSER) {
  require("styles/components/SVGIcon.scss");
}

export default function SVGIcon({ name, active=false, on=false, fill=false, size="medium", badge, ...props }) {

  let className = `SVGIcon ${size}`;

  if (active) {
    className += ` active`;
  }
  if (on) {
    className += ` on`;
  }
  if (fill) {
    className += ` fill`;
  }

  let badgeEl;
  if (typeof badge !== "undefined") {
    // Set visibility hidden to leave the space once the badge get a value
    badgeEl = (
      <span className="SVGIcon-badge"
        style={ badge === 0 ? { visibility: "hidden" } : null }>
        { badge }
      </span>
    );
  }

  const style = { ...props.style };
  if (props.onClick) {
    style.cursor = "pointer";
  }

  return (
    <span style={ style } className={ className } { ...props }>
      <span className={ `SVGIcon-icon ${name}` } />
      { badgeEl }
    </span>

  );

}
