import React from "react";
import CountryFlag from '../helper/CountryFlag.jsx';

if (process.env.BROWSER) {
  require("styles/components/CountryShelfButton.scss");
}

export default function CountryShelfButton(props) {
  return (
    <div className="CountryShelfButton">
      <CountryFlag code={ props.country }/>
      <span className="text-holder">{ props.city }</span>
    </div>
  );
}
