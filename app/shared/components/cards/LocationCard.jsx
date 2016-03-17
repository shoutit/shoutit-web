import React from "react";
import { Link } from "react-router";
import { Icon, Column } from "../helper";
import GoogleStaticMap from "../misc/GoogleStaticMap.jsx";
import CountryFlag from "../helper/CountryFlag.jsx";

if (process.env.BROWSER) {
  require("styles/components/CardBlock.scss");
  require("styles/components/LocationCard.scss");
}

export default function LocationCard({ location }) {
  return (
    <Column clear size="3" className="CardBlock grayCard">
      <div className="CardBlock-headerHolder">
        <Icon name="call-to-action"/>
        <span className="CardBlock-headerTitle">location</span>
      </div>
      <GoogleStaticMap location={ location }/>
      <span className="LocationCard-addr">{ location.address }</span>

      <span className="LocationCard-city">
        <CountryFlag
          code={ location.country }
          size="small"
        />
      </span>
      <span className="LocationCard-city">
        { location.city }
      </span>

    </Column>
  );
}
