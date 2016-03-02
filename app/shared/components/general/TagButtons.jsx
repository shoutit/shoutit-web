import React from "react";
import { Link } from "react-router";

if(process.env.BROWSER) {
  require("styles/components/TagButtons.scss");
}

export default function TagButtons({ tags = [], showWithType = false }) {

  const tagsList = tags.map((tag, i) =>
    <Link to={`/tag/${encodeURIComponent(tag.value.slug)}`} key={tag + i}>
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
    <div className="TagButtons">
      {tagsList}
    </div>
  );
}
