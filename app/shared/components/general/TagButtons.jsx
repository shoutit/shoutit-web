import React from "react";
import { Link } from "react-router";

if(process.env.BROWSER) {
  require("styles/components/TagButtons.scss");
}

export default function TagButtons({ tags = [], showWithType = false, linear = false, currentLocation }) {
  const { city, state, country } = currentLocation;

  const tagsList = tags.map((tag, i) =>
    <Link to={`/tag/${tag.value.slug}/${country}/${state}/${city}`} key={tag + i}>
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
