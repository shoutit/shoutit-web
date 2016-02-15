import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { imagesPath } from "../../../../config";

import { countries } from "../../../../assets/countries/countries-en.json";

const VERSION = 1;

if (process.env.BROWSER) {
  require("styles/components/CountryFlag.scss");
}

export default function CountryFlag({ code, size }) {
  code = code.toUpperCase();

  let className = "CountryFlag";

  if (size) {
    className += ` size-${size}`;
  }

  const tooltip = (
    <Tooltip>{ countries[code] }</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={ tooltip }>
      <span className={ className }>
          <img src={ `${imagesPath}/flags/${code}.png?v${VERSION}` } />
      </span>
    </OverlayTrigger>
  );
}
