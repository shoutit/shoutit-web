import React from "react";
import { Link } from "react-router";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function CategoryIcon({ icon, slug, tooltip, className, size = "30px"}) {

  const categoryTooltip = (
    <Tooltip>{ tooltip }</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={ categoryTooltip }>
      <span className={ className } >
          <Link to={ `/interest/${slug}` }>
            <img src={ icon } style={{ height: size, width: size }}/>
          </Link>
      </span>
    </OverlayTrigger>
  );
}
