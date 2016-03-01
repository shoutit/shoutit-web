import React from 'react';
import {Link} from 'react-router';

export default function TagList({ tags = [] }) {

  const tagsList = tags.map((tag, i) =>
    <Link to={`/tag/${encodeURIComponent(tag.slug)}.${encodeURIComponent(tag.value.slug)}`} key={tag + i}>
      <span className="si-tag">
          {tag.value.name}
      </span>
    </Link>
  );

  return (
    <div className="si-tag-list">
      {tagsList}
    </div>
  );
};
