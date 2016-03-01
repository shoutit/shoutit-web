import React from "react";
import { Link } from "react-router";

if(process.env.BROWSER) {
  require("styles/components/TagButtons.scss");
}

export default function TagList({ tags = [] }) {

  const tagsList = tags.map((tag, i) =>
    <Link to={`/tag/${encodeURIComponent(tag.value.slug)}`} key={tag + i}>
      <span className="TagButtons-button">
          {tag.value.name}
      </span>
    </Link>
  );

  return (
    <div className="TagButtons">
      {tagsList}
    </div>
  );
}
