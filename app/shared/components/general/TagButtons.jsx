import React from "react";
import { Link } from "react-router";

if(process.env.BROWSER) {
  require("styles/components/TagButtons.scss");
}

export default function TagButtons({ tags = [], showWithType = false, linear = false, currentLocation }) {
  const { country } = currentLocation;
  const countryCode = country? country.toLowerCase(): "";

  const tagsList = tags.map((tag, i) =>
    <Link to={`/interest/${tag.value.slug}/${countryCode}`} key={tag + i}>
      <span className="TagButtons-button">
        {showWithType?
          `${tag.name}: ${tag.value.name}`
        :
          tag.value.name
        }
      </span>
    </Link>
  );

  return (
    <div className={ linear? `TagButtons linear`: `TagButtons` }>
      {tagsList}
    </div>
  );
}
