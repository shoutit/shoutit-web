import React from "react";
import { Link } from "react-router";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function CategoryIcon({ icon, slug, tooltip, className, style }) {

  const categoryTooltip = (
    <Tooltip>{ tooltip }</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={ categoryTooltip }>
      <span className={ className } style={ style }>
          <Link to={ `/tag/${slug}` }>
            <img src={ icon } />
          </Link>
      </span>
    </OverlayTrigger>
  );
}
